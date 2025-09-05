import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../../features/auth/authSlice";

const VITE_ENV_MODE = import.meta.env.VITE_ENV_MODE;
const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_DEV_URL = import.meta.env.VITE_DEV_URL;
const baseURL =
    VITE_ENV_MODE == "DEV"
        ? `${VITE_DEV_URL}` // during development, requests go to proxy
        : `${VITE_API_URL}`; // production backend

const baseQuery = fetchBaseQuery({
    baseUrl: `${baseURL}/api/v1`, // adjust as needed
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
            { url: "/users/refresh-token", method: "POST" },
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
