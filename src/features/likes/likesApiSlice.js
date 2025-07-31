import { apiSlice } from "../../app/api/apiSlice";

export const likesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        toggleVideoLike: builder.mutation({
            query: (videoId) => ({
                url: `likes/toggle/v/${videoId}`,
                method: "POST",
            }),
        }),
        toggleCommentLike: builder.mutation({
            query: (commentId) => ({
                url: `likes/toggle/c/${commentId}`,
                method: "POST",
            }),
        }),
        clearLikedVideos: builder.mutation({
            query: () => ({
                url: `likes/videos/delete`,
                method: "delete",
            }),
        }),
        getLikedVideos: builder.query({
            query: () => "likes/videos",
        }),
    }),
});

export const {
    useToggleVideoLikeMutation,
    useToggleCommentLikeMutation,
    useGetLikedVideosQuery,
    useClearLikedVideosMutation,
} = likesApiSlice;
