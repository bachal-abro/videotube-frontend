import { configureStore } from "@reduxjs/toolkit";
import homeFeedSlice from "./homeFeedSlice";
import authSlice from "./authSlice";
import fetchStatusSlice from "./fetchStatusSlice";
import videoViewSlice from "./videoViewSlice";
import commentsSlice from "./commentsSlice";

const vibeVerseStore = configureStore({
    reducer: {
        auth: authSlice.reducer,
        fetchStatus: fetchStatusSlice.reducer,
        homeFeed: homeFeedSlice.reducer,
        videoView: videoViewSlice.reducer,
        comments: commentsSlice.reducer,
    }
})

export default vibeVerseStore;
