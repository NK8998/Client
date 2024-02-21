import { configureStore } from "@reduxjs/toolkit";
import homeSlice from "./Slices/home-slice";
import watchSlice from "./Slices/watch-slice";
import authSlice from "./Slices/auth-slice";
import appSlice from "./Slices/app-slice";

const store = configureStore({
  reducer: {
    app: appSlice,
    home: homeSlice,
    watch: watchSlice,
    auth: authSlice,
  },
});

export default store;
