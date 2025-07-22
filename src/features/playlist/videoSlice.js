import { createSlice, current } from "@reduxjs/toolkit";

const videoSlice = createSlice({
    name: "video",
    initialState: {
        currentVideo: {},
        videoFeed: [],
    },
    reducers: {
        setVideoFeed: (state, action) => {
            // If user is provided, update it; otherwise, keep the existing user
            state.videoFeed = action.payload;
        },
        setCurrentVideo: (state, action) => {
            state.currentVideo = action.payload;
        },
    },
});

export const { setVideoFeed, setCurrentVideo } =
    videoSlice.actions;
export default videoSlice.reducer;
