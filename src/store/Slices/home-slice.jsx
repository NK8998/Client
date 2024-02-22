import { createSlice } from "@reduxjs/toolkit";
import { fetchWatchData } from "./watch-slice";
import { handleNavigation, updateIsFetching, updateLocation } from "./app-slice";

const homeSlice = createSlice({
  name: "home",
  initialState: {
    recommendedVideos: [],
    videosTimeTracker: {},
  },
  reducers: {
    updateRecommendedVides: (state, action) => {
      state.recommendedVideos = action.payload;
    },
  },
});

export const { updateRecommendedVides } = homeSlice.actions;
export default homeSlice.reducer;

export const fetchRecommendedVideos = () => {
  return async (dispatch, getState) => {
    const currentRoute = window.location.pathname.split("?")[0];

    const recommendations = getState().home.recommendedVideos;
    if (recommendations.length > 0) {
      dispatch(updateLocation(currentRoute));
      dispatch(handleNavigation("/"));
      return;
    }
    dispatch(updateIsFetching());

    const simulate = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          { videoId: "ajdjJI900", title: "ajndjas" },
          { videoId: "ajdjJI900", title: "ajndjas" },
          { videoId: "ajdjJI900", title: "ajndjas" },
        ]);
      }, 3000);
    });

    dispatch(updateLocation(currentRoute));
    dispatch(updateIsFetching());
    dispatch(handleNavigation("/"));
    dispatch(updateRecommendedVides(simulate));
  };
};
