import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";
import videoReducer from "../features/videos/videoSlice";
import { videosApiSlice } from "../features/videos/videosApiSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        video: videoReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        [videosApiSlice.reducerPath]: videosApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            apiSlice.middleware,
            videosApiSlice.middleware
        ),
    devTools: true,
});
