import { apiSlice } from "../../app/api/apiSlice";

export const videoCommentsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getVideoComments: builder.query({
            query: (videoId) => `/comments/${videoId}`,
        }),
        updateVideoComment: builder.mutation({
            query: (videoId, videoData) => ({
                url: `/comments/${videoId}`,
                method: "update",
                body: { content: videoData },
            }),
        }),
        createVideoComment: builder.mutation({
            query: ({ videoId, content }) => ({
                url: `/comments/${videoId}`,
                method: "POST",
                body: { content },
            }),
        }),

        deleteVideoComment: builder.mutation({
            query: (videoId) => ({
                url: `/videos/${videoId}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetVideoCommentsQuery,
    useUpdateVideoCommentMutation,
    useCreateVideoCommentMutation,
    useDeleteVideoCommentMutation,
} = videoCommentsApiSlice;
