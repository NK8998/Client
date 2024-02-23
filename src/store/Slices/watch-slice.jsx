import { createSlice } from "@reduxjs/toolkit";
import { handleNavigation, updateIsFetching, updateLocation } from "./app-slice";

const watchSlice = createSlice({
  name: "watch",
  initialState: {
    playingVideo: { videoId: "", aspectRatio: 16 / 9, url: "", descriptionString: "", duration: 0 },
    recommendations: [],
    theatreMode: false,
  },
  reducers: {
    updatePlayingVideo: (state, action) => {
      state.playingVideo = action.payload;
    },
    updateRecommendedVideosWatch: (state, action) => {
      state.recommendations = action.payload;
    },
    toggleTheatreMode: (state, action) => {
      state.theatreMode = !state.theatreMode;
    },
  },
});

export const { updatePlayingVideo, updateRecommendedVideosWatch, toggleTheatreMode } = watchSlice.actions;

export default watchSlice.reducer;

export const fetchWatchData = (videoId, currentRoute) => {
  return async (dispatch, getState) => {
    const recommendations = getState().watch.recommendations;
    const currentId = getState().watch.playingVideo.videoId;
    if (recommendations.length > 0 && currentId === videoId) {
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
    const string1 =
      "ajknjksfnjksdbf\n asdabbf\n\najdbajksf\n adjbadsjh\n 0:00 - \n 0:40 - chapter2\n 1:00 - chapter3\n 1:10 - chapter4\n 4efnjksdfbsjkdfbjksdfbsjk";
    const string2 = "jkcnjkanscjkanscj ascajkcnasc\n acjasnkcjansc\nasnacacacabcjasc\nascbhasbcjah\n\n   ac";

    const wide =
      "https://getting-started8998.s3.ap-south-1.amazonaws.com/%5B219%5D+AVATAR+2+The+Way+of+Water+(2022)+Ultrawide+4K+HDR+Trailer+++UltrawideVideos/output.mpd";
    const normal = "https://getting-started8998.s3.ap-south-1.amazonaws.com/Microsoft+Flight+Simulator+2024+-+Announce+Trailer+-+4K/output.mpd";
    const randomInt = Math.round(Math.random());
    const videosArr = [
      { videoId: simulatePlayingVideo, aspectRatio: 16 / 9, url: normal, descriptionString: string1, duration: 134 },
      { videoId: simulatePlayingVideo, aspectRatio: 1920 / 824, url: wide, descriptionString: string1, duration: 96 },
    ];
    const playingVideoData = videosArr[randomInt];
    const recommendationsData = simulateRecommendations;
    dispatch(updateIsFetching());
    dispatch(updateLocation(currentRoute));
    dispatch(updatePlayingVideo(playingVideoData));
    dispatch(updateRecommendedVideosWatch(recommendationsData));
    dispatch(handleNavigation("/watch"));
  };
};
