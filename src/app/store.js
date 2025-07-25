import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/users/userSlice";
import commentReducer from "../features/comments/commentSlice";
import videoReducer from "../features/videos/videoSlice";
import playlistReducer from "../features/playlist/playlistSlice";
import { videosApiSlice } from "../features/videos/videosApiSlice";
import { usersApiSlice } from "../features/users/usersApiSlice";
import { subscriptionApiSlice } from "../features/subscription/subscriptionApiSlice";
import { videoCommentsApiSlice } from "../features/comments/videoCommentsApiSlice";
import { playlistsApiSlice } from "../features/playlist/playlistsApiSlice";
import systemReducer from "../features/system/systemSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        video: videoReducer,
        comments: commentReducer,
        system: systemReducer,
        playlist: playlistReducer,
        user: userReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        [usersApiSlice.reducerPath]: usersApiSlice.reducer,
        [videosApiSlice.reducerPath]: videosApiSlice.reducer,
        [subscriptionApiSlice.reducerPath]: subscriptionApiSlice.reducer,
        [videoCommentsApiSlice.reducerPath]: videoCommentsApiSlice.reducer,
        [playlistsApiSlice.reducerPath]: playlistsApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            apiSlice.middleware,
            usersApiSlice.middleware,
            videosApiSlice.middleware,
            subscriptionApiSlice.middleware,
            videoCommentsApiSlice.middleware,
            playlistsApiSlice.middleware
        ),
    devTools: true,
});
