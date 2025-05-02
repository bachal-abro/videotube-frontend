import { createSlice, current } from "@reduxjs/toolkit";

const videoSlice = createSlice({
    name: "video",
    initialState: {
        currentVideo: {},
        videoFeed: [],
        currentVideoOwner: {},
        currentVideoOwnerSubscription: {},
    },
    reducers: {
        setVideoFeed: (state, action) => {
            // If user is provided, update it; otherwise, keep the existing user
            state.videoFeed = action.payload;
        },
        setCurrentVideo: (state, action) => {
            state.currentVideo = action.payload;
        },
        setCurrentVideoOwner: (state, action) => {
            state.currentVideoOwner = action.payload;
        },
        setCurrentVideoOwnerSubscription: (state, action) => {
            state.currentVideoOwnerSubscription = action.payload;
        },
    },
});

export const { setVideoFeed, setCurrentVideo, setCurrentVideoOwner, setCurrentVideoOwnerSubscription } =
    videoSlice.actions;
export default videoSlice.reducer;
