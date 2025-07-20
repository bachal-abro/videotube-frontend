import { apiSlice } from "../../app/api/apiSlice";

export const videoCommentsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // 🟢 GET comments for a video
        getVideoComments: builder.query({
            query: ({ videoId, page = 1, limit = 10 }) =>
                `/comments/${videoId}?page=${page}&limit=${limit}`,
            serializeQueryArgs: ({ endpointName }) => endpointName, // persist cache per endpoint
            merge: (currentCache, newItems) => {
                currentCache.data.push(...newItems.data);
                currentCache.pagination = newItems.pagination;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page;
            },
        }),
        
        // 🟢 CREATE new comment or reply
        createVideoComment: builder.mutation({
            query: ({ videoId, content, parentCommentId }) => ({
                url: `/comments/${videoId}`,
                method: "POST",
                body: { content, parentCommentId },
            }),
            async onQueryStarted({ videoId }, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled; // response structure

                    dispatch(
                        videoCommentsApiSlice.util.updateQueryData(
                            "getVideoComments",
                            videoId,
                            (draft) => {
                                const newComment = data?.data;

                                if (!newComment || !draft?.data) return;

                                // ✅ Prevent duplicates
                                const alreadyExists = draft.data.some(
                                    (c) => c._id === newComment._id
                                );

                                if (!alreadyExists) {
                                    draft.data.push(newComment);
                                }
                            }
                        )
                    );
                } catch (err) {
                    console.error("Error updating comment cache:", err);
                }
            },
        }),

        // 🟡 UPDATE an existing comment
        updateVideoComment: builder.mutation({
            query: ({ commentId, content }) => ({
                url: `/comments/${commentId}`,
                method: "PATCH", // use PATCH for partial updates
                body: { content },
            }),
        }),

        // 🔴 DELETE a comment
        deleteVideoComment: builder.mutation({
            query: ({ commentId }) => ({
                url: `/comments/${commentId}`,
                method: "DELETE",
            }),
            async onQueryStarted(
                { commentId, videoId },
                { dispatch, queryFulfilled }
            ) {
                try {
                    await queryFulfilled;
                    // ⛔ Remove deleted comment from cache
                    dispatch(
                        videoCommentsApiSlice.util.updateQueryData(
                            "getVideoComments",
                            videoId,
                            (draft) => {
                                return draft.filter(
                                    (comment) => comment._id !== commentId
                                );
                            }
                        )
                    );
                } catch (err) {
                    console.error("Error deleting comment:", err);
                }
            },
        }),
    }),
});

export const {
    useGetVideoCommentsQuery,
    useUpdateVideoCommentMutation,
    useCreateVideoCommentMutation,
    useDeleteVideoCommentMutation,
} = videoCommentsApiSlice;
