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
        
    }),
});

export const { useToggleVideoLikeMutation, useToggleCommentLikeMutation } =
    likesApiSlice;
