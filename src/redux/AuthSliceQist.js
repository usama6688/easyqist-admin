import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "authSliceQist",
    version: 1,
    storage,
    blacklist: [],
};

const initialState = {
    isLoggedIn: false,
    userDetail: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loggedIn: (state, data) => {
            state.isLoggedIn = true;
            state.userDetail = data.payload.userDetail;
            state.token = data.payload.token;
        },

        userLogout: (state) => {
            state.isLoggedIn = false;
            state.userDetail = null;
            state.token = null;
        },

        updateUserProfile: (state, data) => {
            state.userDetail = { ...state.userDetail, ...data.payload };
        },
    },
});

export const { loggedIn, userLogout } = authSlice.actions;

export default persistReducer(persistConfig, authSlice.reducer);