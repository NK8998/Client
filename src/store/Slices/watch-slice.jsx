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
        id: 3,
        created_at: "2024-03-15T21:42:21.699399+00:00",
        video_id: "ZMIjWdisZf4",
        resolutions: [
          {
            width: 1920,
            height: 1080,
            bitrate: 2500,
            framerate: 23.976023976023978,
            tag: "1080p",
            supersript: "HD",
          },
          {
            width: 1280,
            height: 720,
            bitrate: 2000,
            framerate: 23.976023976023978,
            tag: "720p",
            supersript: "",
          },
          {
            width: 640,
            height: 360,
            bitrate: 800,
            framerate: 23.976023976023978,
            tag: "360p",
            supersript: "",
          },
          {
            width: 256,
            height: 144,
            bitrate: 200,
            framerate: 23.976023976023978,
            tag: "144p",
            supersript: "",
          },
        ],
        extraction_and_palette: { extractionRate: 1, paletteSize: 5 },
        captions_url: null,
        channel_id: "UCISaSW2bq0PcmxxsejrESu81eUff2",
        mpd_url: "https://getting-started8998.s3.ap-south-1.amazonaws.com/ZMIjWdisZf4/chunks/output.mpd",
        possible_thumbnail_urls: {
          "thumbnailUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/ZMIjWdisZf4/possible_thumbnails/output_0001_preview.jpeg",
          "thumbnailUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/ZMIjWdisZf4/possible_thumbnails/output_0074_preview.jpeg",
          "thumbnailUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/ZMIjWdisZf4/possible_thumbnails/output_0146_preview.jpeg",
        },
        preferred_thumbnail_url: null,
        palette_urls: {
          "palleteUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/ZMIjWdisZf4/palletes/batch_001_palette.jpeg",
          "palleteUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/ZMIjWdisZf4/palletes/batch_002_palette.jpeg",
          "palleteUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/ZMIjWdisZf4/palletes/batch_003_palette.jpeg",
          "palleteUrl-3": "https://getting-started8998.s3.ap-south-1.amazonaws.com/ZMIjWdisZf4/palletes/batch_004_palette.jpeg",
          "palleteUrl-4": "https://getting-started8998.s3.ap-south-1.amazonaws.com/ZMIjWdisZf4/palletes/batch_005_palette.jpeg",
          "palleteUrl-5": "https://getting-started8998.s3.ap-south-1.amazonaws.com/ZMIjWdisZf4/palletes/batch_006_palette.jpeg",
        },
        duration: 148.106,
        description_string:
          "ajknjksfnjksdbf\n asdabbf\n\najdbajksf\n adjbadsjh\n 0:00 - \n 0:40 - chapter2 \n 1:00 - chapter3 \n 1:10 - chapter4 \n 4efnjksdfbsjkdfbjksdfbsjk",
        duration_timestamp: "02:28",
        aspect_ratio: 1.778,
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
        extraction_and_palette: { extractionRate: 1, paletteSize: 5 },
        captions_url: null,
        channel_id: "UCISaSW2bq0PcmxxsejrESu81eUff2",
        mpd_url: "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/chunks/output.mpd",
        possible_thumbnail_urls: {
          "thumbnailUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/possible_thumbnails/output_0001_preview.jpeg",
          "thumbnailUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/possible_thumbnails/output_0072_preview.jpeg",
          "thumbnailUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/possible_thumbnails/output_0142_preview.jpeg",
        },
        preferred_thumbnail_url: null,
        palette_urls: {
          "palleteUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/palletes/batch_001_palette.jpeg",
          "palleteUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/palletes/batch_002_palette.jpeg",
          "palleteUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/palletes/batch_003_palette.jpeg",
          "palleteUrl-3": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/palletes/batch_004_palette.jpeg",
          "palleteUrl-4": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/palletes/batch_005_palette.jpeg",
          "palleteUrl-5": "https://getting-started8998.s3.ap-south-1.amazonaws.com/fgj89bjloQ/palletes/batch_006_palette.jpeg",
        },
        duration: 144.144,
        description_string: null,
        duration_timestamp: "02:24",
        aspect_ratio: 2.406,
      },
      {
        id: 8,
        created_at: "2024-03-16T12:25:41.051681+00:00",
        video_id: "01fcm15LWbo",
        resolutions: [
          {
            width: 1920,
            height: 824,
            bitrate: 2500,
            framerate: 25,
            tag: "1080p",
            supersript: "HD",
          },
          {
            width: 1280,
            height: 548,
            bitrate: 2000,
            framerate: 25,
            tag: "720p",
            supersript: "",
          },
          {
            width: 640,
            height: 274,
            bitrate: 800,
            framerate: 25,
            tag: "360p",
            supersript: "",
          },
          {
            width: 256,
            height: 110,
            bitrate: 200,
            framerate: 25,
            tag: "144p",
            supersript: "",
          },
        ],
        extraction_and_palette: { extractionRate: 1, paletteSize: 5 },
        captions_url: null,
        channel_id: "UCISaSW2bq0PcmxxsejrESu81eUff2",
        mpd_url: "https://getting-started8998.s3.ap-south-1.amazonaws.com/01fcm15LWbo/chunks/output.mpd",
        possible_thumbnail_urls: {
          "thumbnailUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/01fcm15LWbo/possible_thumbnails/output_0001_preview.jpeg",
          "thumbnailUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/01fcm15LWbo/possible_thumbnails/output_0048_preview.jpeg",
          "thumbnailUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/01fcm15LWbo/possible_thumbnails/output_0094_preview.jpeg",
        },
        preferred_thumbnail_url: null,
        palette_urls: {
          "palleteUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/01fcm15LWbo/palletes/batch_001_palette.jpeg",
          "palleteUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/01fcm15LWbo/palletes/batch_002_palette.jpeg",
          "palleteUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/01fcm15LWbo/palletes/batch_003_palette.jpeg",
          "palleteUrl-3": "https://getting-started8998.s3.ap-south-1.amazonaws.com/01fcm15LWbo/palletes/batch_004_palette.jpeg",
        },
        duration: 96.36,
        description_string: null,
        duration_timestamp: "01:36",
        aspect_ratio: 2.33,
        title: "[219] AVATAR 2 The Way of Water (2022) Ultrawide 4K HDR Trailer   UltrawideVideos.mp4",
      },
    ];
    const playingVideoData = videosArr.find((video) => video.video_id === videoId);
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
