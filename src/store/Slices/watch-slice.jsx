import { createSlice } from "@reduxjs/toolkit";
import { handleNavigation, updateIsFetching, updateLocation } from "./app-slice";
import { useNavigate } from "react-router-dom";
import { updateSettingsShowing } from "./player-slice";
import AxiosFetching from "../../utilities/axios-function";

// store each retrieved video and its recommendations in an array
const watchSlice = createSlice({
  name: "watch",
  initialState: {
    playingVideo: { videoId: "", aspectRatio: 16 / 9, url: "", descriptionString: "", duration: 0 },
    recommendations: [],
    theatreMode: false,
    fullScreen: false,
    miniPlayer: false,
    retrievedVideos: [{ videoId: "", recommendations: [], videoData: {} }],
  },
  reducers: {
    updatePlayingVideo: (state, action) => {
      state.playingVideo = action.payload;
    },
    updateRecommendedVideosWatch: (state, action) => {
      state.recommendations = action.payload;
    },
    toggleTheatreMode: (state, action) => {
      state.theatreMode = action.payload;
    },
    toggleFullScreen: (state, action) => {
      state.fullScreen = action.payload;
    },
    updateRetrievedVideos: (state, action) => {
      state.retrievedVideos = [...state.retrievedVideos, action.payload];
    },
    toggleMiniPlayer: (state, action) => {
      state.miniPlayer = action.payload;
    },
  },
});

export const { updatePlayingVideo, updateRecommendedVideosWatch, toggleTheatreMode, toggleFullScreen, updateRetrievedVideos, toggleMiniPlayer } =
  watchSlice.actions;

export default watchSlice.reducer;

let timeoutRef;
export const fetchWatchData = (videoId, currentRoute) => {
  return async (dispatch, getState) => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
    const currentVideoId = getState().watch.playingVideo.videoId;
    const isFetching = getState().app.isFetching;
    const location = getState().app.location;
    const miniPlayer = getState().watch.miniPlayer;
    if (currentVideoId === videoId && location.includes("watch")) return;
    if (isFetching) return;
    dispatch(updateIsFetching());

    const retrievedVideos = getState().watch.retrievedVideos;
    const currentVideo = retrievedVideos.find((retrievedVideo) => retrievedVideo.videoId === videoId);
    // check whether the videoId exists in the retrievedVideos array first if it does just update the playingvideo values and recommendations
    // and navigate immediately
    if (currentVideo) {
      dispatch(updatePlayingVideo(currentVideo.videoData));
      dispatch(updateRecommendedVideosWatch(currentVideo.recommendations));
      dispatch(updateIsFetching());

      if (miniPlayer) {
        timeoutRef = setTimeout(() => {
          dispatch(updateLocation(currentRoute));

          dispatch(handleNavigation("/watch"));
        }, 50);
      } else {
        dispatch(updateLocation(currentRoute));

        dispatch(handleNavigation("/watch"));
      }
      return;
    }
    let playingVideo;
    const formData = new FormData();
    formData.append("videoId", videoId);
    await AxiosFetching("post", "watch-video", formData).then((response) => {
      if (response.error) {
        dispatch(updateIsFetching());
        dispatch(handleNavigation("/watch"));
        dispatch(updateLocation(currentRoute));
        return;
      }
      playingVideo = response.data;
      dispatch(updateIsFetching());
      dispatch(updatePlayingVideo(response.data));
      if (window.location.pathname.includes("watch")) {
        dispatch(handleNavigation("/watch"));
        dispatch(updateLocation(currentRoute));
      }
    });

    AxiosFetching("get", "browse", {}).then((response) => {
      const newVideoObject = { videoId: videoId, recommendations: response.data, videoData: playingVideo };
      dispatch(updateRecommendedVideosWatch(response.data));
      dispatch(updateRetrievedVideos(newVideoObject));
    });
  };
};

export const handleTheatre = (theatreMode) => {
  return (dispatch) => {
    if (document.fullscreenElement) {
      dispatch(toggleTheatreMode(true));
      dispatch(toggleFullScreen(false));
    } else {
      if (theatreMode) {
        dispatch(toggleTheatreMode(false));
      } else {
        dispatch(toggleTheatreMode(true));
      }
    }
  };
};

export const handleFullscreen = (fullScreen) => {
  return (dispatch) => {
    const root = document.querySelector("#root");

    if (!root) return;
    if (!fullScreen && window.location.pathname.includes("watch")) {
      root.scrollTo({ top: 0, behavior: "instant" });
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
          dispatch(toggleFullScreen(true));
        });
      }
    } else if (fullScreen) {
      if (document.fullscreenElement) {
        document.exitFullscreen().then(() => {
          dispatch(toggleFullScreen(false));
        });
      }
    }
  };
};

let intervalRef;
export const handleMiniPLayer = (miniPlayer) => {
  return async (dispatch, getState) => {
    await new Promise((resolve, reject) => {
      intervalRef = setInterval(() => {
        const isFetching = getState().app.isFetching;
        if (!isFetching) {
          resolve(true);
          clearInterval(intervalRef);
        }
      }, 50);
    });
    if (miniPlayer) {
      if (document.fullscreenElement) {
        document.exitFullscreen().then(() => {
          dispatch(toggleFullScreen(false));
          dispatch(toggleMiniPlayer(true));
        });
      } else {
        dispatch(toggleMiniPlayer(true));
      }
    } else {
      dispatch(toggleMiniPlayer(false));
    }
    dispatch(updateSettingsShowing(false));
  };
};
