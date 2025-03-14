import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1/users", // adjust as needed
    credentials: "include", // ensure cookies (for refresh token) are sent
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // If the access token is expired, backend returns 401
    if (result?.error?.originalStatus === 401) {
        console.log("Access token expired. Attempting to refresh...");
        // Attempt to refresh the access token
        const refreshResult = await baseQuery(
            { url: "/refresh-token", method: "POST" },
            api,
            extraOptions
        );
        if (refreshResult?.data) {
            // Update the state with the new access token
            api.dispatch(
                setCredentials({ token: refreshResult.data.accessToken })
            );
            // Retry the original query with new token
            result = await baseQuery(args, api, extraOptions);
        } else {
            // If refresh fails, log out the user
            api.dispatch(logOut());
        }
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({}),
});
