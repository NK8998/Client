import { createSlice } from "@reduxjs/toolkit";
import { fetchWatchData } from "./watch-slice";
import { handleNavigation, updateIsFetching, updateLocation } from "./app-slice";

const homeSlice = createSlice({
  name: "home",
  initialState: {},
  reducers: {},
});

export default homeSlice.reducer;

export const handleSelectedVideo = (videoId) => {
  return async (dispatch) => {
    const simulate = await new Promise((resolve, reject) => {
      setTimeout(() => {
        fetchWatchData(videoId);
        resolve(videoId);
      }, 3000);
    });

    dispatch(updateLocation("/watch"));
    dispatch(handleNavigation("/watch"));
  };
};
