import { createSlice } from "@reduxjs/toolkit";
import { fetchWatchData, handleMiniPLayer } from "./watch-slice";
import { handleNavigation, updateIsFetching, updateLocation } from "./app-slice";
import AxiosFetching from "../../utilities/axios-function";

const homeSlice = createSlice({
  name: "home",
  initialState: {
    recommendedVideos: [],
    videosTimeTracker: {},
    maxNumVideo: 0,
    maxNumShort: 0,
  },
  reducers: {
    updateRecommendedVides: (state, action) => {
      state.recommendedVideos = action.payload;
    },
    updateMaxSizes: (state, action) => {
      const { max_video, max_short } = action.payload;
      state.maxNumVideo = max_video;
      state.maxNumShort = max_short;
    },
  },
});

export const { updateRecommendedVides, updateMaxSizes } = homeSlice.actions;
export default homeSlice.reducer;

export const fetchRecommendedVideos = () => {
  return async (dispatch, getState) => {
    const currentRoute = window.location.pathname.split("?")[0];

    const recommendations = getState().home.recommendedVideos;
    const miniPlayerBoolean = getState().watch.miniPlayerBoolean;
    if (recommendations.length > 0) {
      dispatch(updateLocation(currentRoute));
      dispatch(handleNavigation("/"));
      if (miniPlayerBoolean) {
        dispatch(handleMiniPLayer(true));
      }
      return;
    }
    dispatch(updateIsFetching());

    const { data, error } = await AxiosFetching("get", "browse", {});

    if (error) {
      dispatch(updateLocation(currentRoute));
      dispatch(updateIsFetching());
      dispatch(handleNavigation("/"));
      return;
      // display error banner
    }

    dispatch(updateLocation(currentRoute));
    dispatch(updateIsFetching());
    dispatch(handleNavigation("/"));
    if (miniPlayerBoolean) {
      dispatch(handleMiniPLayer(true));
    }
    dispatch(updateRecommendedVides(data));
  };
};

export function updateMaxNums() {
  return (dispatch) => {
    const gridContainerRef = document.querySelector(".grid-container");
    if (!gridContainerRef) return;
    let videoMinWidth;
    //   if (window.innerWidth >= 1440) {
    //     videoMinWidth = 330;
    //   } else {
    //     videoMinWidth = 360;
    //   }
    videoMinWidth = 320;
    const shortMinWidth = 210;
    const width = gridContainerRef.getBoundingClientRect().width - 38;

    const maxNum = Math.max(1, Math.floor(width / videoMinWidth));
    const maxNumShort = Math.max(1, Math.floor(width / shortMinWidth));
    const gaps = (maxNum - 1) * 5;
    const containerWidth = Math.floor((width - gaps) / maxNum);
    document.documentElement.style.setProperty("--skeletonWidth", `${containerWidth > 512 ? 512 : containerWidth}px`);

    const sizeObj = { max_video: maxNum, max_short: maxNumShort };
    dispatch(updateMaxSizes(sizeObj));
  };
}
