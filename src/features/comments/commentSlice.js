import { createSlice, current } from "@reduxjs/toolkit";

const commentSlice = createSlice({
    name: "comments",
    initialState: {
        currentVideoComments: [],
    },
    reducers: {
        setCurrentVideoComments: (state, action) => {
            state.currentVideoComments = action.payload;
        },
    },
});

export const { setCurrentVideoComments } =
commentSlice.actions;
export default commentSlice.reducer;
