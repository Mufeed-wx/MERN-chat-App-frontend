import { createSlice } from "@reduxjs/toolkit";
import appApi from '../services/appApi';

export const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: {
        addNotifications: (state, { payload }) => {
            if (state.newMessage[payload]) {
                state.newMessage[payload] = state.newMessage[payload] + 1;
            } else {
                state.newMessage[payload] = 1;
            }
         },
        resetNotification: (state, { payload }) => {
            delete state.newMessage[payload];
         },
    },
    extraReducers: (builder) => {
        //save user after signup
        builder.addMatcher(appApi.endpoints.signupUser.matchFulfilled, (state, { payload }) => payload);
        //save user after login
        builder.addMatcher(appApi.endpoints.loginUser.matchFulfilled, (state, { payload }) => payload);
        //logout:destroy usersession
        builder.addMatcher(appApi.endpoints.logoutUser.matchFulfilled, () => null);
    }
})

export const { addNotifications, resetNotification } = userSlice.actions;
export default userSlice.reducer;