import { createSlice, current } from "@reduxjs/toolkit";

const systemSlice = createSlice({
    name: "system",
    initialState: {
        sidebarOpen: true,
    },
    reducers: {
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSmallScreenSidebar: (state) => {
            state.sidebarOpen = false;
        },
    },
});

export const { setSidebarOpen, setSmallScreenSidebar } = systemSlice.actions;
export default systemSlice.reducer;
