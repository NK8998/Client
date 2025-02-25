import { configureStore } from "@reduxjs/toolkit";
import homeSlice from "./Slices/home-slice";
import watchSlice from "./Slices/watch-slice";
import authSlice from "./Slices/auth-slice";
import appSlice from "./Slices/app-slice";
import channelSlice from "./Slices/channel-slice";
import playerSlice from "./Slices/player-slice";

const store = configureStore({
  reducer: {
    app: appSlice,
    home: homeSlice,
    watch: watchSlice,
    player: playerSlice,
    auth: authSlice,
    channel: channelSlice,
  },
});

export default store;
