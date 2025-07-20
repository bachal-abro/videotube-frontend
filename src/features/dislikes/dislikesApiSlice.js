import { apiSlice } from "../../app/api/apiSlice";

export const dislikesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        toggleVideoDislike: builder.mutation({
            query: (videoId) => ({
                url: `dislikes/toggle/v/${videoId}`,
                method: "POST",
            }),
        }),
        toggleCommentDislike: builder.mutation({
            query: (commentId) => ({
                url: `dislikes/toggle/c/${commentId}`,
                method: "POST",
            }),
        }),
    }),
});

export const { useToggleVideoDislikeMutation, useToggleCommentDislikeMutation } =
    dislikesApiSlice;
