import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "users/login",
                method: "POST",
                body: { ...credentials },
            }),
        }),
        refreshAccessToken: builder.mutation({
            query: () => ({
                url: "/users/refresh-token",
                method: "POST",
            }),
        }),
        getUser: builder.mutation({
            query: () => ({
                url: "users/current-user",
                method: "GET",
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "users/logout",
                method: "POST",
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRefreshAccessTokenMutation,
    useGetUserMutation,
    useLogoutMutation,
} = authApiSlice;
