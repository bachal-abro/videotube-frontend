import { createSlice, current } from "@reduxjs/toolkit";

const systemSlice = createSlice({
    name: "system",
    initialState: {
        sidebarOpen: true,
    },
    reducers: {
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = !(state.sidebarOpen);
        },
    },
});

export const { setSidebarOpen } =
    systemSlice.actions;
export default systemSlice.reducer;
