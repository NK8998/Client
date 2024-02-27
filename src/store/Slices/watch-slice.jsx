import { createSlice } from "@reduxjs/toolkit";
import { handleNavigation, updateIsFetching, updateLocation } from "./app-slice";
import { useNavigate } from "react-router-dom";

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

export const fetchWatchData = (videoId, currentRoute) => {
  return async (dispatch, getState) => {
    const currentVideoId = getState().watch.playingVideo.videoId;
    const isFetching = getState().app.isFetching;
    const location = getState().app.location;
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
      dispatch(updateLocation(currentRoute));

      dispatch(handleNavigation("/watch"));
      dispatch(updateIsFetching());
      return;
    }
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
    const string1 =
      "ajknjksfnjksdbf\n asdabbf\n\najdbajksf\n adjbadsjh\n 0:00 - \n 0:40 - chapter2\n 1:00 - chapter3\n 1:10 - chapter4\n 4efnjksdfbsjkdfbjksdfbsjk";
    const string2 = "jkcnjkanscjkanscj ascajkcnasc\n acjasnkcjansc\nasnacacacabcjasc\nascbhasbcjah\n\n   ac";

    const wide =
      "https://getting-started8998.s3.ap-south-1.amazonaws.com/%5B219%5D+AVATAR+2+The+Way+of+Water+(2022)+Ultrawide+4K+HDR+Trailer+++UltrawideVideos/output.mpd";
    const normal = "https://getting-started8998.s3.ap-south-1.amazonaws.com/Microsoft+Flight+Simulator+2024+-+Announce+Trailer+-+4K/output.mpd";
    // const randomInt = Math.round(Math.random());
    const videosArr = [
      { videoId: "i94bjbYU", aspectRatio: 16 / 9, url: normal, descriptionString: string1, duration: 134 },
      { videoId: "I938buiYN", aspectRatio: 1920 / 824, url: wide, descriptionString: string2, duration: 96 },
    ];
    const playingVideoData = videoId === "i94bjbYU" ? videosArr[0] : videosArr[1];
    const recommendationsData = simulateRecommendations;
    const newVideoObject = { videoId: videoId, recommendations: recommendationsData, videoData: playingVideoData };
    dispatch(updateIsFetching());
    dispatch(updateRetrievedVideos(newVideoObject));
    dispatch(updatePlayingVideo(playingVideoData));
    dispatch(updateRecommendedVideosWatch(recommendationsData));
    if (window.location.pathname.includes("watch")) {
      dispatch(handleNavigation("/watch"));
      dispatch(updateLocation(currentRoute));
    }
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

    if (!fullScreen && window.location.pathname.includes("watch") && root) {
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
  };
};
