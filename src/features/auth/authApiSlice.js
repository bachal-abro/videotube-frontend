import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: { ...credentials },
            }),
        }),
        refreshAccessToken: builder.mutation({
            query: () => ({
                url: "/refresh-token",
                method: "POST",
            }),
        }),
        getUser: builder.mutation({
            query: () => ({
                url: "/current-user",
                method: "GET",
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRefreshAccessTokenMutation,
    useGetUserMutation,
} = authApiSlice;
