import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user || state.user;
            state.token = token;
        },
        login: (state, action) => {
            state.status = true;
            state.authData = action.payload;
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
        },
    },
});

export const { login, logOut, setCredentials } = authSlice.actions;
export default authSlice;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
