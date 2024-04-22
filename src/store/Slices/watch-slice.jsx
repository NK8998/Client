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
    fetchingRecommendations: false,
    isTransitioning: false,
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
    updatefetchingRecommendations: (state, action) => {
      state.fetchingRecommendations = !state.fetchingRecommendations;
    },
    updateIsTransitioning: (state, action) => {
      state.isTransitioning = !state.isTransitioning;
    },
  },
});

export const {
  updatePlayingVideo,
  updateRecommendedVideosWatch,
  toggleTheatreMode,
  toggleFullScreen,
  updateRetrievedVideos,
  toggleMiniPlayer,
  updatefetchingRecommendations,
  updateFullSreenTransition,
  updateIsTransitioning,
} = watchSlice.actions;

export default watchSlice.reducer;

let timeoutRef;
export const fetchWatchData = (videoId, currentRoute, data) => {
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

      if (miniPlayer) return;
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
    if (Object.entries(data).length > 0) {
      playingVideo = data;
      dispatch(updateIsFetching());
      dispatch(updatePlayingVideo(data));
      if (miniPlayer) return;
      dispatch(handleNavigation("/watch"));
      dispatch(updateLocation(currentRoute));
    } else if (Object.entries(data).length === 0) {
      await AxiosFetching("post", "watch-video", formData)
        .then((response) => {
          playingVideo = response.data;
          dispatch(updateIsFetching());
          dispatch(updatePlayingVideo(response.data));
          if (window.location.pathname.includes("watch")) {
            if (miniPlayer) return;
            dispatch(handleNavigation("/watch"));
            dispatch(updateLocation(currentRoute));
          }
        })
        .catch((error) => {
          dispatch(updateIsFetching());
          console.error(error);
          // update fetching error and display error component
        });
    }
    const isWatchPage = location.includes("watch");
    if (!isWatchPage) {
      dispatch(updatefetchingRecommendations());
    }
    AxiosFetching("get", "browse", {})
      .then((response) => {
        shuffleArray(response.data);
        const newVideoObject = { videoId: videoId, recommendations: response.data, videoData: playingVideo };
        dispatch(updateRecommendedVideosWatch(response.data));
        dispatch(updateRetrievedVideos(newVideoObject));
        if (!isWatchPage) {
          dispatch(updatefetchingRecommendations());
        }
      })
      .catch((error) => {
        console.error(error);
        // update fetching error and display error component
      });
  };
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const handleTheatre = (theatreMode) => {
  return (dispatch) => {
    if (document.fullscreenElement) {
      dispatch(toggleTheatreMode(true));
      dispatch(handleFullscreen(true));
      localStorage.setItem("theatreMode", JSON.stringify(true));
    } else {
      if (theatreMode) {
        dispatch(toggleTheatreMode(false));
        localStorage.setItem("theatreMode", JSON.stringify(false));
      } else {
        dispatch(toggleTheatreMode(true));
        localStorage.setItem("theatreMode", JSON.stringify(true));
      }
    }
  };
};

let timeout;
export const handleFullscreen = (fullScreen) => {
  return (dispatch) => {
    const root = document.querySelector("#root");

    if (timeout) {
      clearTimeout(timeout);
    }
    if (!root) return;
    if (!fullScreen && window.location.pathname.includes("watch")) {
      root.scrollTo({ top: 0, behavior: "instant" });
      if (!document.fullscreenElement) {
        root.requestFullscreen().then(() => {
          timeout = setTimeout(() => {
            dispatch(toggleFullScreen(true));
          }, 200);
        });
      }
    } else if (fullScreen) {
      if (document.fullscreenElement) {
        document.exitFullscreen().then(() => {
          timeout = setTimeout(() => {
            dispatch(toggleFullScreen(false));
          }, 200);
        });
      }
    }
  };
};

let intervalRef;
export const handleMiniPLayer = (miniPlayer, currentRoute) => {
  return async (dispatch, getState) => {
    await new Promise((resolve, reject) => {
      intervalRef = setInterval(() => {
        const isFetching = getState().app.isFetching;
        if (!isFetching) {
          resolve(true);
          clearInterval(intervalRef);
        }
      }, 1);
    });
    if (miniPlayer) {
      if (document.fullscreenElement) {
        dispatch(handleFullscreen(true));

        dispatch(toggleMiniPlayer(true));
      } else {
        dispatch(toggleMiniPlayer(true));
      }
    } else {
      dispatch(handleNavigation("/watch"));
      dispatch(updateLocation(currentRoute));
      dispatch(toggleMiniPlayer(false));
    }
    dispatch(updateSettingsShowing(false));
  };
};
