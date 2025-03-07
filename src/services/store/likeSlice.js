import { createSlice } from "@reduxjs/toolkit";

const initialState =
{
    likesList: [],
    toggleLike: (id) => { },
}

const likeSlice = createSlice({
    name: 'like',
    initialState,
    reducers: {
        toggleLike: (state, action) => {
            state.likesList = action.payload;
        }
    }
});

export const { toggleLike } = likeSlice.actions;
export default likeSlice;