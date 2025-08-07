import { apiSlice } from "../../app/api/apiSlice";

export const videosApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllVideos: builder.query({
            query: () => "/videos",
        }),
        getAllVideosOfUser: builder.query({
            query: () => "/videos/user/current",
        }),
        getVideosFromSubscriptions: builder.query({
            query: () => "/videos/subscriptions",
        }),
        getVideoById: builder.query({
            query: (videoId) => `/videos/${videoId}`,
        }),
        uploadVideo: builder.mutation({
            query: (videoData) => ({
                url: "/videos",
                method: "POST",
                body: videoData,
            }),
        }),
        deleteVideo: builder.mutation({
            query: ({ videoId }) => ({
                url: `/videos/${videoId}`,
                method: "DELETE",
            }),
        }),
        toggleVisibilityStatus: builder.mutation({
            query: ({ videoId, visibilityStatus }) => ({
                url: `/videos/toggle/visibility/${videoId}/`,
                method: "PATCH",
                body: { visibilityStatus },
            }),
        }),
    }),
});

export const {
    useGetAllVideosQuery,
    useGetAllVideosOfUserQuery,
    useGetVideosFromSubscriptionsQuery,
    useGetVideoByIdQuery,
    useUploadVideoMutation,
    useDeleteVideoMutation,
    useToggleVisibilityStatusMutation,
} = videosApiSlice;
