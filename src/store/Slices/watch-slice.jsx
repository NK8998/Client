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

    const wide = "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/chunks/output.mpd";
    const normal = "https://getting-started8998.s3.ap-south-1.amazonaws.com/ZMIjWdisZf4/chunks/output.mpd";
    // const randomInt = Math.round(Math.random());
    const videosArr = [
      {
        video_id: "i94bjbYU",
        aspect_ratio: 16 / 9,
        mpd_url: normal,
        description_string: string1,
        duration: 148,
        captions_url: null,
      },
      {
        id: 2,
        created_at: "2024-03-14T16:46:37.372007+00:00",
        video_id: "fgj89bjloQ",
        resolutions: [
          {
            width: 1920,
            height: 798,
            bitrate: 2500,
            framerate: 23.976023976023978,
            tag: "1080p",
            supersript: "HD",
          },
          {
            width: 1280,
            height: 532,
            bitrate: 2000,
            framerate: 23.976023976023978,
            tag: "720p",
            supersript: "",
          },
          {
            width: 640,
            height: 266,
            bitrate: 800,
            framerate: 23.976023976023978,
            tag: "360p",
            supersript: "",
          },
          {
            width: 256,
            height: 106,
            bitrate: 200,
            framerate: 23.976023976023978,
            tag: "144p",
            supersript: "",
          },
        ],
        extraction_and_palette: { extractionRate: 2, paletteSize: 3 },
        captions_url: null,
        channel_id: "UCISaSW2bq0PcmxxsejrESu81eUff2",
        mpd_url: "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/chunks/output.mpd",
        possible_thumbnail_urls: {
          "thumbnailUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/possible_thumbnails/output_0002_preview.jpeg",
          "thumbnailUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/possible_thumbnails/output_0038_preview.jpeg",
          "thumbnailUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/possible_thumbnails/output_0072_preview.jpeg",
        },
        preferred_thumbnail_url: null,
        palette_urls: {
          "palleteUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/palletes/batch_1_palette.jpeg",
          "palleteUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/palletes/batch_2_palette.jpeg",
          "palleteUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/palletes/batch_3_palette.jpeg",
          "palleteUrl-3": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/palletes/batch_4_palette.jpeg",
          "palleteUrl-4": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/palletes/batch_5_palette.jpeg",
          "palleteUrl-5": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/palletes/batch_6_palette.jpeg",
          "palleteUrl-6": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/palletes/batch_7_palette.jpeg",
          "palleteUrl-7": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/palletes/batch_8_palette.jpeg",
          "palleteUrl-8": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/palletes/batch_9_palette.jpeg",
        },
        duration: 144.144,
        description_string: null,
        duration_timestamp: "02:24",
        aspect_ratio: 2.406,
      },
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
