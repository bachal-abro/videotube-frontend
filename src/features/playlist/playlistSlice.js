import { createSlice, current } from "@reduxjs/toolkit";

const playlistSlice = createSlice({
    name: "playlist",
    initialState: {
        currentPlaylist: {},
        userPlaylists: [],
    },
    reducers: {
        setUserPlaylists: (state, action) => {
            state.userPlaylists = action.payload;
        },
        setCurrentPlaylist: (state, action) => {
            state.currentPlaylist = action.payload;
        },
    },
});

export const { setUserPlaylists, setCurrentPlaylist } =
    playlistSlice.actions;
export default playlistSlice.reducer;
