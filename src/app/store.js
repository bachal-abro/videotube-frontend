import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";
import commentReducer from "../features/comments/commentSlice";
import videoReducer from "../features/videos/videoSlice";
import { videosApiSlice } from "../features/videos/videosApiSlice";
import { subscriptionApiSlice } from "../features/subscription/subscriptionApiSlice";
import { videoCommentsApiSlice } from "../features/comments/videoCommentsApiSlice";
import systemReducer from "../features/system/systemSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        video: videoReducer,
        comments: commentReducer,
        system: systemReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        [videosApiSlice.reducerPath]: videosApiSlice.reducer,
        [subscriptionApiSlice.reducerPath]: subscriptionApiSlice.reducer,
        [videoCommentsApiSlice.reducerPath]: videoCommentsApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            apiSlice.middleware,
            videosApiSlice.middleware,
            subscriptionApiSlice.middleware,
            videoCommentsApiSlice.middleware
        ),
    devTools: true,
});
