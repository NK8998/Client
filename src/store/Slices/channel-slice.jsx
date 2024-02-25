import { createSlice } from "@reduxjs/toolkit";
import { handleNavigation, updateLocation } from "./app-slice";

const channelSlice = createSlice({
  name: "channel",
  initialState: {
    currentChannel: "",
  },
  reducers: {
    updateCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
  },
});

export const { updateCurrentChannel } = channelSlice.actions;
export default channelSlice.reducer;

export const fetchFeaturedContent = (targetRoute) => {
  return async (dispatch) => {
    const featuredContent = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    const currentChannel = targetRoute.split("/")[1];

    dispatch(handleNavigation("/:channel"));
    dispatch(updateLocation(targetRoute));
    dispatch(updateCurrentChannel(currentChannel));
  };
};

export const fetchLiveContent = (targetRoute) => {
  return async (dispatch) => {
    const LiveContent = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    const currentChannel = targetRoute.split("/")[1];

    dispatch(handleNavigation("/:channel"));
    dispatch(updateLocation(targetRoute));
    dispatch(updateCurrentChannel(currentChannel));
  };
};

export const fetchPlayListsContent = (targetRoute) => {
  return async (dispatch) => {
    const playlistContent = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    const currentChannel = targetRoute.split("/")[1];

    dispatch(handleNavigation("/:channel"));
    dispatch(updateLocation(targetRoute));
    dispatch(updateCurrentChannel(currentChannel));
  };
};

export const fetchShortsContent = (targetRoute) => {
  return async (dispatch) => {
    const shortsContent = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    const currentChannel = targetRoute.split("/")[1];

    dispatch(handleNavigation("/:channel"));
    dispatch(updateLocation(targetRoute));
    dispatch(updateCurrentChannel(currentChannel));
  };
};

export const fetchVideosContent = (targetRoute) => {
  return async (dispatch) => {
    const videosContent = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    const currentChannel = targetRoute.split("/")[1];

    dispatch(handleNavigation("/:channel"));
    dispatch(updateLocation(targetRoute));
    dispatch(updateCurrentChannel(currentChannel));
  };
};

export const fetchCommunityContent = (targetRoute) => {
  return async (dispatch) => {
    const communityContent = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    const currentChannel = targetRoute.split("/")[1];

    dispatch(handleNavigation("/:channel"));
    dispatch(updateLocation(targetRoute));
    dispatch(updateCurrentChannel(currentChannel));
  };
};
