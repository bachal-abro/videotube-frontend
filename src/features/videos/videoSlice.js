import { createSlice, current } from "@reduxjs/toolkit";

const videoSlice = createSlice({
    name: "video",
    initialState: {
        currentVideo: {},
        videoFeed: [],
        subscriptionFeed: [],
    },
    reducers: {
        setVideoFeed: (state, action) => {
            state.videoFeed = action.payload;
        },
        setSubscriptionFeed: (state, action) => {
            state.subscriptionFeed = action.payload;
        },
        setCurrentVideo: (state, action) => {
            state.currentVideo = action.payload;
        },
    },
});

export const { setVideoFeed, setCurrentVideo, setSubscriptionFeed } =
    videoSlice.actions;
export default videoSlice.reducer;
