import { createSlice, current } from "@reduxjs/toolkit";
import { fetchWatchData, toggleFullScreen } from "./watch-slice";

const appSlice = createSlice({
  name: "app",
  initialState: {
    isFetching: false,
    refs: [],
    locationsArr: [],
    location: "",
    windowWidth: window.innerWidth,
    prefersMini: false,
  },
  reducers: {
    updateRefs: (state, action) => {
      // refs are in the form {watch: watchRef, home: homeRef}
      state.refs = action.payload;
    },
    updateIsFetching: (state, action) => {
      state.isFetching = !state.isFetching;
    },
    updateLocation: (state, action) => {
      state.location = action.payload;
    },
    updateWindowWidth: (state, action) => {
      state.windowWidth = action.payload;
    },
    updatePreference: (state, action) => {
      state.prefersMini = !state.prefersMini;
    },
    upadteLocationsArr: (state, action) => {
      state.locationsArr = [action.payload, ...state.locationsArr];
    },
  },
});

export const { updateRefs, updateIsFetching, updateLocation, updateWindowWidth, updatePreference, upadteLocationsArr } = appSlice.actions;
export default appSlice.reducer;

export const handleNavigation = (targetRoute) => {
  return (dispatch, getState) => {
    if (!targetRoute.includes("watch")) {
      if (document.fullscreenElement) {
        document.exitFullscreen().then(() => {
          dispatch(toggleFullScreen(false));
        });
      }
    }
    const refs = getState().app.refs;
    const currentRoute = refs.find((ref) => ref.route === targetRoute);

    // Get a reference to the actual DOM node
    const currentDOMNode = document.getElementById(currentRoute.ref);
    currentDOMNode.classList.remove("hidden");

    refs.map((ref) => {
      if (ref.route !== targetRoute) {
        // Get a reference to the actual DOM node
        const domNode = document.getElementById(ref.ref);
        domNode.classList.add("hidden");
      }
    });
  };
};

export const handleNavResize = () => {
  return (dispatch, getState) => {
    const windowWidth = window.innerWidth;
    const location = getState().app.location;
    const isWatchPage = location.includes("watch");

    const leftNavMain = document.querySelector(".leftnav-wrapper");
    if (!leftNavMain) return;
    if (!isWatchPage) {
      if (windowWidth >= 1024) {
        leftNavMain.classList.toggle("hide-home");
        dispatch(updatePreference());
      } else if (windowWidth < 1024) {
        leftNavMain.classList.toggle("show-not-watch");
      }
    } else if (isWatchPage) {
      leftNavMain.classList.toggle("show");
    }
  };
};

const addRemoveWatchPageStyle = () => {
  const isWatchPage = window.location.pathname.includes("watch");
  const leftNavMain = document.querySelector(".leftnav-wrapper");

  if (isWatchPage) {
    leftNavMain.classList.add("hide");
    leftNavMain.classList.remove("not-watch");
  } else {
    leftNavMain.classList.remove("hide");
    leftNavMain.classList.add("not-watch");
  }
};

export const handleResize = () => {
  return (dispatch) => {
    const windowWidth = window.innerWidth;
    const leftNavMain = document.querySelector(".leftnav-wrapper");
    if (!leftNavMain) return;

    if (windowWidth >= 1024) {
      leftNavMain.classList.remove("show-not-watch");
    } else if (windowWidth < 1024) {
      leftNavMain.classList.add("hide");
    }
    addRemoveWatchPageStyle();

    dispatch(updateWindowWidth(windowWidth));
  };
};

export const handlePopState = () => {
  return async (dispatch, getState) => {
    const isFetching = getState().app.isFetching;
    const url = new URL(window.location.href);
    const currentRoute = url.pathname;
    const videoId = url.search.split("=")[1];
    const isWatchPage = currentRoute.includes("watch");
    if (isWatchPage) {
      dispatch(fetchWatchData(videoId, currentRoute));
    }
  };
};

export const handleFullscreenChange = () => {
  return (dispatch) => {
    if (window.location.pathname.includes("watch")) {
      if (document.fullscreenElement) {
        dispatch(toggleFullScreen(true));
      } else {
        dispatch(toggleFullScreen(false));
      }
    } else {
      dispatch(toggleFullScreen(false));
    }
  };
};
