import { apiSlice } from "../../app/api/apiSlice";

export const videosApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllVideos: builder.query({
            query: () => "/videos",
        }),
        getVideoById: builder.query({
            query: (videoId) => `/videos/${videoId}`,
        }),
        createVideo: builder.mutation({
            query: (videoData) => ({
                url: "/videos",
                method: "POST",
                body: videoData,
            }),
        }),
        deleteVideo: builder.mutation({
            query: (videoId) => ({
                url: `/videos/${videoId}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetAllVideosQuery,
    useGetVideoByIdQuery,
    useCreateVideoMutation,
    useDeleteVideoMutation,
} = videosApiSlice;
