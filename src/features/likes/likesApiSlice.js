import { apiSlice } from "../../app/api/apiSlice";

export const likesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        toggleVideoLike: builder.mutation({
            query: (videoId) => ({
                url: `likes/toggle/v/${videoId}`,
                method: "POST",
            }),
        }),
    }),
});

export const {
    useGetSubscribersQuery,
    useGetSubscribedChannelsQuery,
    useToggleVideoLikeMutation,
    useGetSubscriptionStatusQuery,
} = likesApiSlice;
