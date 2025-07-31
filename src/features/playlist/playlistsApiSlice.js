import { apiSlice } from "../../app/api/apiSlice";

export const playlistsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPlaylist: builder.query({
            query: ({ playlistId }) => `/playlist/${playlistId}`,
        }),

        getUserPlaylists: builder.query({
            query: (userId) => `/playlist/user/${userId}`,
            providesTags: (result, error, userId) =>
                result ? [{ type: "Playlists", id: userId }] : [],
        }),

        addVideoToPlaylist: builder.mutation({
            query: ({ videoId, playlistIds, thumbnail }) => ({
                url: `/playlist/add/${videoId}`,
                method: "PATCH",
                body: {
                    playlistIds: playlistIds,
                    videoId: videoId,
                    thumbnail: thumbnail,
                },
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
        editPlaylist: builder.mutation({
            query: ({ playlistId, name, description }) => ({
                url: `/playlist/${playlistId}`,
                method: "PATCH",
                body: { name, description },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Playlists", id: arg.userId },
            ],
        }),

        deletePlaylist: builder.mutation({
            query: (playlistId) => ({
                url: `/playlist/${playlistId}`,
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
    useEditPlaylistMutation,
    useAddVideoToPlaylistMutation,
    useRemoveVideoFromPlaylistMutation,
} = playlistsApiSlice;
