import { createSlice } from "@reduxjs/toolkit";
import { handleNavigation, updateIsFetching, updateLocation } from "./app-slice";

const channelSlice = createSlice({
  name: "channel",
  initialState: {
    currentChannel: "",
    featured: { initial: [], dynamic: [] },
    videos: { initial: [], dynamic: [] },
    live: { initial: [], dynamic: [] },
    playlists: { initial: [], dynamic: [] },
    shorts: { initial: [], dynamic: [] },
    community: { initial: [], dynamic: [] },
  },
  reducers: {
    updateCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
    updateTabContent: (state, action) => {
      const tabs = [
        { tab: "featured", state: state.featured },
        { tab: "videos", state: state.videos },
        { tab: "live", state: state.live },
        { tab: "playlists", state: state.playlists },
        { tab: "shorts", state: state.shorts },
        { tab: "community", state: state.community },
      ];

      const { tabName, content } = action.payload;

      const tabToUpdate = tabs.find((tab) => tab.tab === tabName);
      if (tabToUpdate) {
        tabToUpdate.state.initial = content;
      }
    },
  },
});

export const { updateCurrentChannel, updateTabContent } = channelSlice.actions;
export default channelSlice.reducer;

let timeoutRef;

let instanceArr = [];

const finalStep = (dispatch, currentChannel, targetRoute, instanceObj, getState) => {
  const isFetching = getState().app.isFetching;
  // Sort the array based on the difference between Date.now() and the UID of each instance
  instanceArr.sort((a, b) => Math.abs(Date.now() - a.UID) - Math.abs(Date.now() - b.UID));

  // Get the instance with the smallest difference
  const latestInstance = instanceArr[0];

  // Check if the instance for which finalStep is being called is the latest one
  if (instanceObj.UID !== latestInstance.UID || isFetching) return;

  dispatch(handleNavigation("/:channel"));
  dispatch(updateLocation(targetRoute));
  dispatch(updateCurrentChannel(currentChannel));
  // instanceArr = [];
};

export const fetchTabContent = (targetRoute, contentType) => {
  return async (dispatch, getState) => {
    const currentRoute = getState().app.location;
    if (currentRoute === targetRoute) return;
    console.log({ instance: Date.now() });
    const instanceObj = { instance: contentType, UID: Date.now() };
    instanceArr.push(instanceObj);
    dispatch(updateIsFetching());
    const initialContent = getState().channel[contentType].initial;
    if (initialContent.length > 0) {
      dispatch(updateIsFetching());

      const currentChannel = targetRoute.split("/")[1];

      finalStep(dispatch, currentChannel, targetRoute, instanceObj, getState);

      return;
    }

    const content = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          { videoId: "ajdjJI900", title: "ajndjas" },
          { videoId: "ajdjJI900", title: "ajndjas" },
          { videoId: "ajdjJI900", title: "ajndjas" },
        ]);
      }, 2000);
    });
    const tabObj = { tabName: contentType, content: content };

    dispatch(updateTabContent(tabObj));

    const currentChannel = targetRoute.split("/")[1];
    dispatch(updateIsFetching());
    finalStep(dispatch, currentChannel, targetRoute, instanceObj, getState);
  };
};
