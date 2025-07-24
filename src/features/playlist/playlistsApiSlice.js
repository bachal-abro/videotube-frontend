import { apiSlice } from "../../app/api/apiSlice";

export const playlistsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPlaylist: builder.query({
            query: (playlistId) => `/playlist/${playlistId}`,
        }),

        getUserPlaylists: builder.query({
            query: (userId) => `/playlist/user/${userId}`,
            providesTags: (result, error, userId) =>
                result ? [{ type: "Playlists", id: userId }] : [],
        }),

        addVideoToPlaylist: builder.mutation({
            query: ({ videoId, playlistIds }) => ({
                url: `/playlist/add/${videoId}`,
                method: "PATCH",
                body: { playlistIds: playlistIds, videoId: videoId },
            }),
        }),

        removeVideoFromPlaylist: builder.mutation({
            query: ({ videoId, playlistIds }) => ({
                url: `/playlist/remove/${videoId}`,
                method: "PATCH",
                body: { playlistIds: playlistIds, videoId: videoId },
            }),
        }),

        createPlaylist: builder.mutation({
            query: (playlistData) => ({
                url: "/playlist",
                method: "POST",
                body: { ...playlistData },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Playlists", id: arg.userId },
            ],
        }),
        
        deletePlaylist: builder.mutation({
            query: (playlistId) => ({
                url: `/videos/${playlistId}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetPlaylistQuery,
    useGetUserPlaylistsQuery,
    useCreatePlaylistMutation,
    useDeletePlaylistMutation,
    useAddVideoToPlaylistMutation,
    useRemoveVideoFromPlaylistMutation,
} = playlistsApiSlice;
