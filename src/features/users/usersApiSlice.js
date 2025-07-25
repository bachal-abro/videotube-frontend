import { apiSlice } from "../../app/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => "users/current-user",
            keepUnusedDataFor: 60,
        }),
        getUserHistory: builder.query({
            query: () => "users/history/videos",
        }),

        removeVideoFromHistory: builder.mutation({
            query: ({ videoId }) => ({
                url: `/users/history/remove/${videoId}`,
                method: "PATCH",
            }),
        }),
        clearHistory: builder.mutation({
            query: () => ({
                url: `/users/history/clear`,
                method: "PATCH",
            }),
        }),

        getUserById: builder.query({
            query: (userId) => `users/${userId}`,
            keepUnusedDataFor: 60,
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useGetUserHistoryQuery,
    useRemoveVideoFromHistoryMutation,
    useClearHistoryMutation,
} = usersApiSlice;
