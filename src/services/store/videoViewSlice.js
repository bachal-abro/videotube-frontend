import { createSlice } from "@reduxjs/toolkit";

const initialState =
{
    video: {}
}

const videoViewSlice = createSlice({
    name: 'videoView',
    initialState,
    reducers: {
        view: (state, action) => {
            state.video = action.payload;
        }
    }
});

export const { view } = videoViewSlice.actions;
export default videoViewSlice;