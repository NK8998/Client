import { createSlice } from "@reduxjs/toolkit";
import { fetchWatchData, handleFullscreen, toggleFullScreen, updateNotFound } from "./watch-slice";
import { updateMaxNums } from "./home-slice";
import { updateSettingsShowing } from "./player-slice";

const appSlice = createSlice({
  name: "app",
  initialState: {
    hasAccount: false,
    credentialsChecked: false,
    userData: {},
    isFetching: false,
    refs: [],
    lastVisited: "",
    location: "",
    windowWidth: window.innerWidth,
    prefersMini: false,
    debounceTime: 100,
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
    updateLastVisited: (state, action) => {
      state.lastVisited = action.payload;
    },
    updateCredentialsCheck: (state, action) => {
      state.credentialsChecked = action.payload;
    },
    updateUserData: (state, action) => {
      state.userData = action.payload;
    },
    updateHasAccount: (state, action) => {
      state.hasAccount = action.payload;
    },
  },
});

export const {
  updateRefs,
  updateIsFetching,
  updateLocation,
  updateWindowWidth,
  updatePreference,
  updateLastVisited,
  updateCredentialsCheck,
  updateUserData,
  updateHasAccount,
} = appSlice.actions;
export default appSlice.reducer;

export const handleNavigation = (targetRoute) => {
  return (dispatch, getState) => {
    if (!targetRoute.includes("watch")) {
      dispatch(updateNotFound(false));
      if (document.fullscreenElement) {
        document.exitFullscreen().then(() => {
          dispatch(handleFullscreen(true));
        });
      }
      dispatch(updateSettingsShowing(false));
    }
    const refs = getState().app.refs;
    const currentRoute = refs.find((ref) => ref.route === targetRoute);

    // Get a reference to the actual DOM node
    const currentDOMNode = document.getElementById(currentRoute.ref);
    currentDOMNode.removeAttribute("hidden");
    currentDOMNode.classList.remove("hidden");

    refs.map((ref) => {
      if (ref.route !== targetRoute) {
        // Get a reference to the actual DOM node
        const domNode = document.getElementById(ref.ref);
        domNode.setAttribute("hidden", "");
        domNode.classList.add("hidden");
      }
    });
  };
};

export const handleNavResize = () => {
  return (dispatch, getState) => {
    const location = getState().app.location;
    const isWatchPage = location.includes("watch");
    const windowWidth = getState().app.windowWidth;

    const leftNavMain = document.querySelector(".leftnav-wrapper");
    if (!leftNavMain) return;
    if (!isWatchPage) {
      if (windowWidth >= 1344) {
        leftNavMain.classList.toggle("hide-home");
        dispatch(updatePreference());
      } else if (windowWidth < 1344) {
        leftNavMain.classList.toggle("show-not-watch");
      }

      dispatch(updateMaxNums());
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

const updateStyles = (element, width, height) => {
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
  element.style.maxWidth = `${width}px`;
  element.style.maxHeight = `${height}px`;
};

export const handleResize = () => {
  return (dispatch) => {
    const app = document.querySelector(".app");
    const body = document.body;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const leftNavMain = document.querySelector(".leftnav-wrapper");
    if (!app || !body) return;
    updateStyles(body, windowWidth, windowHeight);
    updateStyles(app, windowWidth, windowHeight);

    if (!leftNavMain) return;

    if (windowWidth >= 1344) {
      leftNavMain.classList.remove("show-not-watch");
    } else if (windowWidth < 1344) {
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
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get("v");
    const isWatchPage = currentRoute.includes("watch");
    if (isWatchPage) {
      dispatch(fetchWatchData(videoId, currentRoute, {}));
    }
  };
};

let timeout;
export const handleFullscreenChange = () => {
  if (timeout) {
    clearTimeout(timeout);
  }

  return (dispatch) => {
    if (window.location.pathname.includes("watch")) {
      if (document.fullscreenElement) {
        timeout = setTimeout(() => {
          dispatch(toggleFullScreen(true));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          dispatch(toggleFullScreen(false));
        }, 100);
      }
    } else {
      timeout = setTimeout(() => {
        dispatch(toggleFullScreen(false));
      }, 100);
    }
  };
};
