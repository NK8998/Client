import { createSlice } from "@reduxjs/toolkit";

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
  },
});

export const { updatePlayingVideo } = watchSlice.actions;

export default watchSlice.reducer;

export const fetchWatchData = async (videoId) => {
  return async (dispatch) => {
    const data = { videoId: videoId };
    dispatch(updatePlayingVideo(data));
  };
};
