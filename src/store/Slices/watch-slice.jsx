import { createSlice } from "@reduxjs/toolkit";
import { handleNavigation, updateIsFetching, updateLocation } from "./app-slice";
import { updatePlayerState } from "./player-slice";
import AxiosFetching from "../../utilities/axios-function";

// store each retrieved video and its recommendations in an array
const watchSlice = createSlice({
  name: "watch",
  initialState: {
    playingVideo: { videoId: "", aspectRatio: 16 / 9, url: "", descriptionString: "", duration: 0, title: "" },
    recommendations: [],
    theatreMode: false,
    fullScreen: false,
    miniPlayer: false,
    retrievedVideos: [{ videoId: "", recommendations: [], videoData: {} }],
    fetchingRecommendations: false,
    isTransitioning: false,
    miniPlayerBoolean: false,
    notFound: false,
    chaptersListShowing: false,
    syncChaptersToVideoTime: true,
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
    updateMiniPlayerBoolean: (state, action) => {
      state.miniPlayerBoolean = action.payload;
    },
    updateNotFound: (state, action) => {
      state.notFound = action.payload;
    },
    updateWatchState: (state, action) => {
      const { watchPropertyToUpdate, updatedValue } = action.payload;
      state[watchPropertyToUpdate] = updatedValue;
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
  updateMiniPlayerBoolean,
  updateNotFound,
  updateWatchState,
} = watchSlice.actions;

export default watchSlice.reducer;

export const fetchWatchData = (videoId, currentRoute, data = {}) => {
  return async (dispatch, getState) => {
    const app = document.querySelector(".app");
    const currentVideoId = getState().watch.playingVideo.video_id;
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
      dispatch(updateNotFound(false));
      dispatch(updatePlayingVideo(currentVideo.videoData));
      dispatch(updateRecommendedVideosWatch(currentVideo.recommendations));
      dispatch(updateIsFetching());

      if (miniPlayer) return;
      dispatch(updateLocation(currentRoute));

      dispatch(handleNavigation("/watch"));
      app.scrollTo({ top: 0, behavior: "instant" });
      console.log("video already fetched ran");

      return;
    }
    const formData = new FormData();
    formData.append("videoId", videoId);
    if (Object.entries(data).length > 0) {
      dispatch(updateNotFound(false));
      dispatch(updateIsFetching());
      dispatch(updatePlayingVideo(data));

      if (miniPlayer) return;
      dispatch(handleNavigation("/watch"));
      dispatch(updateLocation(currentRoute));
      app.scrollTo({ top: 0, behavior: "instant" });
      console.log("pushed forward ran");
    } else if (Object.entries(data).length === 0) {
      console.log("fetched new ran");
      await AxiosFetching("post", "watch-video", formData)
        .then((response) => {
          if (response.data) {
            dispatch(updatefetchingRecommendations());

            dispatch(updateIsFetching());
            console.log(response.data);

            if (response.data.video && response.data.recommended) {
              const videoData = response.data.video;
              shuffleArray(response.data.recommended);
              const recommendations = response.data.recommended;

              dispatch(updateNotFound(false));
              dispatch(updatePlayingVideo(videoData));

              const newVideoObject = { videoId: videoId, recommendations: recommendations, videoData: videoData };
              dispatch(updateRecommendedVideosWatch(recommendations));
              dispatch(updateRetrievedVideos(newVideoObject));
              dispatch(updatefetchingRecommendations());
            } else if (!response.data.video) {
              dispatch(updateNotFound(true));
              dispatch(updatePlayingVideo({ video_id: videoId, aspect_ratio: 16 / 9, mpd_url: "" }));
              dispatch(updatefetchingRecommendations());
            }

            if (window.location.pathname.includes("watch")) {
              if (miniPlayer) return;

              dispatch(handleNavigation("/watch"));
              dispatch(updateLocation(currentRoute));
              app.scrollTo({ top: 0, behavior: "instant" });
            }
          }
        })
        .catch((error) => {
          dispatch(updateIsFetching());
          dispatch(updatefetchingRecommendations());
          console.error(error);
          // update fetching error and display error component
        });
    }
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
    const app = document.querySelector(".app");

    if (timeout) {
      clearTimeout(timeout);
    }
    if (!root) return;
    if (!fullScreen && window.location.pathname.includes("watch")) {
      if (!document.fullscreenElement) {
        root.requestFullscreen().then(() => {
          timeout = setTimeout(() => {
            dispatch(toggleFullScreen(true));
            app.scrollTo({ top: 0, behavior: "instant" });
          }, 150);
        });
      }
    } else if (fullScreen) {
      if (document.fullscreenElement) {
        document.exitFullscreen().then(() => {
          timeout = setTimeout(() => {
            dispatch(toggleFullScreen(false));
          }, 150);
        });
      }
    }
  };
};

let intervalRef;
export const handleMiniPLayer = (miniPlayer, currentRoute) => {
  return async (dispatch, getState) => {
    // await new Promise((resolve, reject) => {
    //   intervalRef = setInterval(() => {
    //     const isFetching = getState().app.isFetching;
    //     if (!isFetching) {
    //       resolve(true);
    //       clearInterval(intervalRef);
    //     }
    //   }, 1);
    // });
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
    dispatch(updatePlayerState({ playerPropertyToUpdate: "settingsShowing", updatedValue: false }));
  };
};
