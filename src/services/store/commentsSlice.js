import { createSlice } from "@reduxjs/toolkit";

const initialState =
{
    commentsList: [],
}

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        getComments: (state, action) => {
            state.commentsList = action.payload;
        }
    }
});

export const { getComments } = commentsSlice.actions;
export default commentsSlice;