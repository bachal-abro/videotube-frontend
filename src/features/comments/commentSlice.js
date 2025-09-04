import { createSlice, current } from "@reduxjs/toolkit";

const commentSlice = createSlice({
    name: "comments",
    initialState: {
        currentVideoComments: [],
    },
    reducers: {
        setCurrentVideoComments(state, action) {
            const incoming = Array.isArray(action.payload)
                ? action.payload
                : [];
            // create a Map by _id where incoming overrides existing
            const map = new Map();

            // Keep existing items only if not overridden
            state.currentVideoComments.forEach((c) => {
                map.set(c._id, c);
            });

            incoming.forEach((c) => {
                map.set(c._id, c); // incoming replaces existing same _id
            });

            state.currentVideoComments = Array.from(map.values());
        },
    },
});

export const { setCurrentVideoComments } = commentSlice.actions;
export default commentSlice.reducer;
