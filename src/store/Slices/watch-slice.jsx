import { createSlice } from "@reduxjs/toolkit";
import { handleNavigation, updateIsFetching, updateLocation } from "./app-slice";

const watchSlice = createSlice({
  name: "watch",
  initialState: {
    playingVideo: {},
    recommendations: [],
  },
  reducers: {
    updatePlayingVideo: (state, action) => {
      state.playingVideo = action.payload;
    },
    updateRecommendedVideosWatch: (state, action) => {
      state.recommendations = action.payload;
    },
  },
});

export const { updatePlayingVideo, updateRecommendedVideosWatch } = watchSlice.actions;

export default watchSlice.reducer;

export const fetchWatchData = (videoId, currentRoute) => {
  return async (dispatch, getState) => {
    const recommendations = getState().watch.recommendations;
    if (recommendations.length > 0) {
      dispatch(updateLocation(currentRoute));

      dispatch(handleNavigation("/watch"));
      return;
    }
    dispatch(updateIsFetching());
    const simulatePlayingVideo = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(videoId);
      }, 1000);
    });

    const simulateRecommendations = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          { videoId: "ajdjJI900", title: "ajndjas" },
          { videoId: "ajdjJI900", title: "ajndjas" },
          { videoId: "ajdjJI900", title: "ajndjas" },
        ]);
      }, 2000);
    });

    const playingVideoData = { videoId: simulatePlayingVideo };
    const recommendationsData = simulateRecommendations;
    dispatch(updateIsFetching());
    dispatch(updateLocation(currentRoute));
    dispatch(updatePlayingVideo(playingVideoData));
    dispatch(updateRecommendedVideosWatch(recommendationsData));
    dispatch(handleNavigation("/watch"));
  };
};
