import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: { history: [] },
    reducers: {
        setHistory: (state, action) => {
            state.history = action.payload;
        },
    },
});

export const { setHistory, } = userSlice.actions;
export default userSlice.reducer;