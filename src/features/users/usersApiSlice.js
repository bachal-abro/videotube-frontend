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
        updateAccountDetails: builder.mutation({
            query: (formData) => ({
                url: "/users/update-account",
                method: "PATCH",
                body: formData,
            }),
        }),
        updateAvatar: builder.mutation({
            query: (avatar) => ({
                url: "/users/avatar",
                method: "PATCH",
                body: avatar,
            }),
        }),
        updateBanner: builder.mutation({
            query: (banner) => ({
                url: "/users/banner",
                method: "PATCH",
                body: banner,
            }),
        }),
        
        clearHistory: builder.mutation({
            query: () => ({
                url: `/users/history/clear`,
                method: "PATCH",
            }),
        }),
        getUserChannelProfile: builder.query({
            query: (username) => `users/c/${username}`,
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserChannelProfileQuery,
    useGetUserHistoryQuery,
    useRemoveVideoFromHistoryMutation,
    useClearHistoryMutation,
    useUpdateAccountDetailsMutation,
    useUpdateBannerMutation,
    useUpdateAvatarMutation,
} = usersApiSlice;
