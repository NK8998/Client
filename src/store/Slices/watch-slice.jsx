import { createSlice } from "@reduxjs/toolkit";
import { handleNavigation, updateIsFetching, updateLocation } from "./app-slice";
import { useNavigate } from "react-router-dom";
import { updateSettingsShowing } from "./player-slice";

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
        id: 15,
        created_at: "2024-03-16T16:59:01.296616+00:00",
        video_id: "DfYP6AooQ8H",
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
        mpd_url: "https://getting-started8998.s3.ap-south-1.amazonaws.com/DfYP6AooQ8H/chunks/output.mpd",
        possible_thumbnail_urls: {
          "thumbnailUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/DfYP6AooQ8H/possible_thumbnails/output_0001_preview.jpeg",
          "thumbnailUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/DfYP6AooQ8H/possible_thumbnails/output_0048_preview.jpeg",
          "thumbnailUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/DfYP6AooQ8H/possible_thumbnails/output_0094_preview.jpeg",
        },
        preferred_thumbnail_url: null,
        palette_urls: {
          "palleteUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/DfYP6AooQ8H/palletes/batch_001_palette.jpeg",
          "palleteUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/DfYP6AooQ8H/palletes/batch_002_palette.jpeg",
          "palleteUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/DfYP6AooQ8H/palletes/batch_003_palette.jpeg",
          "palleteUrl-3": "https://getting-started8998.s3.ap-south-1.amazonaws.com/DfYP6AooQ8H/palletes/batch_004_palette.jpeg",
        },
        duration: 96.36,
        description_string: null,
        duration_timestamp: "01:36",
        aspect_ratio: 2.33,
        title: "[219] AVATAR 2 The Way of Water (2022) Ultrawide 4K HDR Trailer   UltrawideVideos.mp4",
      },
      {
        id: 18,
        created_at: "2024-03-16T17:05:22.489389+00:00",
        video_id: "QpZYoxRun3B",
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
        mpd_url: "https://getting-started8998.s3.ap-south-1.amazonaws.com/QpZYoxRun3B/chunks/output.mpd",
        possible_thumbnail_urls: {
          "thumbnailUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QpZYoxRun3B/possible_thumbnails/output_0001_preview.jpeg",
          "thumbnailUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QpZYoxRun3B/possible_thumbnails/output_0072_preview.jpeg",
          "thumbnailUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QpZYoxRun3B/possible_thumbnails/output_0142_preview.jpeg",
        },
        preferred_thumbnail_url: null,
        palette_urls: {
          "palleteUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QpZYoxRun3B/palletes/batch_001_palette.jpeg",
          "palleteUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QpZYoxRun3B/palletes/batch_002_palette.jpeg",
          "palleteUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QpZYoxRun3B/palletes/batch_003_palette.jpeg",
          "palleteUrl-3": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QpZYoxRun3B/palletes/batch_004_palette.jpeg",
          "palleteUrl-4": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QpZYoxRun3B/palletes/batch_005_palette.jpeg",
          "palleteUrl-5": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QpZYoxRun3B/palletes/batch_006_palette.jpeg",
        },
        duration: 144.144,
        description_string:
          "ajknjksfnjksdbf\n asdabbf\n\najdbajksf\n adjbadsjh\n 0:00 - \n 0:40 - chapter2 \n 1:00 - chapter3 \n 1:10 - chapter4 \n 1:30 - chapter4 \n 1:40 - chapter4 \n 1:50 - chapter4 \n 1:55 - chapter4 \n 2:10 - chapter4 \n  4efnjksdfbsjkdfbjksdfbsjk",
        duration_timestamp: "02:24",
        aspect_ratio: 2.406,
        title: "Marvel Studios' Avengers Infinity War Official Trailer.mp4",
      },
      {
        id: 19,
        created_at: "2024-03-16T17:07:16.827368+00:00",
        video_id: "F5Uy13S7Wlq",
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
        mpd_url: "https://getting-started8998.s3.ap-south-1.amazonaws.com/F5Uy13S7Wlq/chunks/output.mpd",
        possible_thumbnail_urls: {
          "thumbnailUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/F5Uy13S7Wlq/possible_thumbnails/output_0001_preview.jpeg",
          "thumbnailUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/F5Uy13S7Wlq/possible_thumbnails/output_0074_preview.jpeg",
          "thumbnailUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/F5Uy13S7Wlq/possible_thumbnails/output_0146_preview.jpeg",
        },
        preferred_thumbnail_url: null,
        palette_urls: {
          "palleteUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/F5Uy13S7Wlq/palletes/batch_001_palette.jpeg",
          "palleteUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/F5Uy13S7Wlq/palletes/batch_002_palette.jpeg",
          "palleteUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/F5Uy13S7Wlq/palletes/batch_003_palette.jpeg",
          "palleteUrl-3": "https://getting-started8998.s3.ap-south-1.amazonaws.com/F5Uy13S7Wlq/palletes/batch_004_palette.jpeg",
          "palleteUrl-4": "https://getting-started8998.s3.ap-south-1.amazonaws.com/F5Uy13S7Wlq/palletes/batch_005_palette.jpeg",
          "palleteUrl-5": "https://getting-started8998.s3.ap-south-1.amazonaws.com/F5Uy13S7Wlq/palletes/batch_006_palette.jpeg",
        },
        duration: 148.106,
        description_string: null,
        duration_timestamp: "02:28",
        aspect_ratio: 1.778,
        title: "Avatar The Way of Water   Official Trailer.mp4",
      },
      {
        id: 20,
        created_at: "2024-03-19T14:25:37.01544+00:00",
        video_id: "audxiH_CECi",
        resolutions: [
          {
            width: 3840,
            height: 2160,
            bitrate: 4000,
            framerate: 59.94,
            tag: "2160p",
            supersript: "4k",
          },
          {
            width: 2560,
            height: 1440,
            bitrate: 3000,
            framerate: 59.94,
            tag: "1440p",
            supersript: "HD",
          },
          {
            width: 1920,
            height: 1080,
            bitrate: 2500,
            framerate: 59.94,
            tag: "1080p",
            supersript: "HD",
          },
          {
            width: 1280,
            height: 720,
            bitrate: 2000,
            framerate: 59.94,
            tag: "720p",
            supersript: "",
          },
          {
            width: 640,
            height: 360,
            bitrate: 800,
            framerate: 59.94,
            tag: "360p",
            supersript: "",
          },
          {
            width: 256,
            height: 144,
            bitrate: 200,
            framerate: 59.94,
            tag: "144p",
            supersript: "",
          },
        ],
        extraction_and_palette: { extractionRate: 1, paletteSize: 5 },
        captions_url: null,
        channel_id: "UCISaSW2bq0PcmxxsejrESu81eUff2",
        mpd_url: "https://getting-started8998.s3.ap-south-1.amazonaws.com/audxiH_CECi/chunks/output.mpd",
        possible_thumbnail_urls: {
          "thumbnailUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/audxiH_CECi/possible_thumbnails/output_0001_preview.jpeg",
          "thumbnailUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/audxiH_CECi/possible_thumbnails/output_0064_preview.jpeg",
          "thumbnailUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/audxiH_CECi/possible_thumbnails/output_0125_preview.jpeg",
        },
        preferred_thumbnail_url: null,
        palette_urls: {
          "palleteUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/audxiH_CECi/palletes/batch_001_palette.jpeg",
          "palleteUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/audxiH_CECi/palletes/batch_002_palette.jpeg",
          "palleteUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/audxiH_CECi/palletes/batch_003_palette.jpeg",
          "palleteUrl-3": "https://getting-started8998.s3.ap-south-1.amazonaws.com/audxiH_CECi/palletes/batch_004_palette.jpeg",
          "palleteUrl-4": "https://getting-started8998.s3.ap-south-1.amazonaws.com/audxiH_CECi/palletes/batch_005_palette.jpeg",
          "palleteUrl-5": "https://getting-started8998.s3.ap-south-1.amazonaws.com/audxiH_CECi/palletes/batch_006_palette.jpeg",
        },
        duration: 126.59,
        description_string: null,
        duration_timestamp: "02:07",
        aspect_ratio: 1.778,
        title: "2020 LG OLED l The Black 4K HDR 60fps.mkv",
      },
      {
        id: 22,
        created_at: "2024-03-25T21:14:28.509139+00:00",
        video_id: "XnY3LmSZpFy",
        resolutions: [
          {
            width: 608,
            height: 1080,
            bitrate: 2500,
            framerate: 30,
            tag: "1080p",
            supersript: "HD",
          },
          {
            width: 404,
            height: 720,
            bitrate: 2000,
            framerate: 30,
            tag: "720p",
            supersript: "",
          },
          {
            width: 202,
            height: 360,
            bitrate: 800,
            framerate: 30,
            tag: "360p",
            supersript: "",
          },
          {
            width: 80,
            height: 144,
            bitrate: 200,
            framerate: 30,
            tag: "144p",
            supersript: "",
          },
        ],
        extraction_and_palette: { extractionRate: 1, paletteSize: 5 },
        captions_url: null,
        channel_id: "UCISaSW2bq0PcmxxsejrESu81eUff2",
        mpd_url: "https://getting-started8998.s3.ap-south-1.amazonaws.com/XnY3LmSZpFy/chunks/output.mpd",
        possible_thumbnail_urls: {
          "thumbnailUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/XnY3LmSZpFy/possible_thumbnails/output_0001_preview.jpeg",
          "thumbnailUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/XnY3LmSZpFy/possible_thumbnails/output_0030_preview.jpeg",
          "thumbnailUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/XnY3LmSZpFy/possible_thumbnails/output_0058_preview.jpeg",
        },
        preferred_thumbnail_url: null,
        palette_urls: {
          "palleteUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/XnY3LmSZpFy/palletes/batch_001_palette.jpeg",
          "palleteUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/XnY3LmSZpFy/palletes/batch_002_palette.jpeg",
          "palleteUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/XnY3LmSZpFy/palletes/batch_003_palette.jpeg",
        },
        duration: 60.05,
        description_string: null,
        duration_timestamp: "01:00",
        aspect_ratio: 0.563,
        title: "916 Road Free to Use No Copyright Video   Copyright Free Videos   Free Stock Videos   Free Footage.mkv",
      },
      {
        id: 23,
        created_at: "2024-03-25T21:25:40.899733+00:00",
        video_id: "QJI_jNDhZOe",
        resolutions: [
          {
            width: 640,
            height: 480,
            bitrate: 800,
            framerate: 29.97,
            tag: "360p",
            supersript: "",
          },
          {
            width: 256,
            height: 192,
            bitrate: 200,
            framerate: 29.97,
            tag: "144p",
            supersript: "",
          },
        ],
        extraction_and_palette: { extractionRate: 1, paletteSize: 5 },
        captions_url: null,
        channel_id: "UCISaSW2bq0PcmxxsejrESu81eUff2",
        mpd_url: "https://getting-started8998.s3.ap-south-1.amazonaws.com/QJI_jNDhZOe/chunks/output.mpd",
        possible_thumbnail_urls: {
          "thumbnailUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QJI_jNDhZOe/possible_thumbnails/output_0001_preview.jpeg",
          "thumbnailUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QJI_jNDhZOe/possible_thumbnails/output_0101_preview.jpeg",
          "thumbnailUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QJI_jNDhZOe/possible_thumbnails/output_0200_preview.jpeg",
        },
        preferred_thumbnail_url: null,
        palette_urls: {
          "palleteUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QJI_jNDhZOe/palletes/batch_001_palette.jpeg",
          "palleteUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QJI_jNDhZOe/palletes/batch_002_palette.jpeg",
          "palleteUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QJI_jNDhZOe/palletes/batch_003_palette.jpeg",
          "palleteUrl-3": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QJI_jNDhZOe/palletes/batch_004_palette.jpeg",
          "palleteUrl-4": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QJI_jNDhZOe/palletes/batch_005_palette.jpeg",
          "palleteUrl-5": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QJI_jNDhZOe/palletes/batch_006_palette.jpeg",
          "palleteUrl-6": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QJI_jNDhZOe/palletes/batch_007_palette.jpeg",
          "palleteUrl-7": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QJI_jNDhZOe/palletes/batch_008_palette.jpeg",
          "palleteUrl-8": "https://getting-started8998.s3.ap-south-1.amazonaws.com/QJI_jNDhZOe/palletes/batch_009_palette.jpeg",
        },
        duration: 202.4,
        description_string: null,
        duration_timestamp: "03:22",
        aspect_ratio: 1.333,
        title: "The Bangles - Walk Like an Egyptian (Official Video).mkv",
      },
      {
        id: 25,
        created_at: "2024-03-26T19:29:44.173171+00:00",
        video_id: "xxfoYqTS86d",
        resolutions: [
          {
            width: 1920,
            height: 1080,
            bitrate: 2500,
            framerate: 60,
            tag: "1080p",
            supersript: "HD",
          },
          {
            width: 1280,
            height: 720,
            bitrate: 2000,
            framerate: 60,
            tag: "720p",
            supersript: "",
          },
          {
            width: 640,
            height: 360,
            bitrate: 800,
            framerate: 30,
            tag: "360p",
            supersript: "",
          },
          {
            width: 256,
            height: 144,
            bitrate: 200,
            framerate: 30,
            tag: "144p",
            supersript: "",
          },
        ],
        extraction_and_palette: { extractionRate: 3, paletteSize: 5 },
        captions_url: null,
        channel_id: "UCISaSW2bq0PcmxxsejrESu81eUff2",
        mpd_url: "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/chunks/output.mpd",
        possible_thumbnail_urls: {
          "thumbnailUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/possible_thumbnails/output_0001_preview.jpeg",
          "thumbnailUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/possible_thumbnails/output_0162_preview.jpeg",
          "thumbnailUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/possible_thumbnails/output_0321_preview.jpeg",
        },
        preferred_thumbnail_url: null,
        palette_urls: {
          "palleteUrl-0": "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/palletes/batch_001_palette.jpeg",
          "palleteUrl-1": "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/palletes/batch_002_palette.jpeg",
          "palleteUrl-2": "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/palletes/batch_003_palette.jpeg",
          "palleteUrl-3": "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/palletes/batch_004_palette.jpeg",
          "palleteUrl-4": "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/palletes/batch_005_palette.jpeg",
          "palleteUrl-5": "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/palletes/batch_006_palette.jpeg",
          "palleteUrl-6": "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/palletes/batch_007_palette.jpeg",
          "palleteUrl-7": "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/palletes/batch_008_palette.jpeg",
          "palleteUrl-8": "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/palletes/batch_009_palette.jpeg",
          "palleteUrl-9": "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/palletes/batch_010_palette.jpeg",
          "palleteUrl-10": "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/palletes/batch_011_palette.jpeg",
          "palleteUrl-11": "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/palletes/batch_012_palette.jpeg",
          "palleteUrl-12": "https://getting-started8998.s3.ap-south-1.amazonaws.com/xxfoYqTS86d/palletes/batch_013_palette.jpeg",
        },
        duration: 969.64,
        description_string:
          "HFW running on the RX 580 8GB GDDR5 at 1080p, using the Very Low, Low, Medium and High settings, with and without FSR and XeSS!\n⏱ Timestamps ⏱\nIntro, Specs, Stuff - 0:00\n1080p Very Low - 0:38\n1080p Very Low / FSR Quality - 5:09\n1080p Very Low / XeSS Quality - 6:03\n1080p Low - 6:27\n1080p Medium - 9:27\n1080p Medium / High Textures - 12:52\n1080p High / Medium Textures - 14:11\n🔧SPECS🔧\n◾️ AMD Ryzen 5 3600X\n◾️ AMD Radeon RX 580 8GB - XFX GTS XXX\n◾️ RAM - 16GB DDR4 3200MHz (2x8GB)\n",
        duration_timestamp: "16:10",
        aspect_ratio: 1.778,
        title: "RX 580 8GB - Horizon Forbidden West.mkv",
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

[];
