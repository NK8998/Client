import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    isFetching: false,
    refs: [],
    location: "",
    windowWidth: window.innerWidth,
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
  },
});

export const { updateRefs, updateIsFetching, updateLocation, updateWindowWidth } = appSlice.actions;
export default appSlice.reducer;

export const handleNavigation = (targetRoute) => {
  return (dispatch, getState) => {
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

    if (!isWatchPage) {
      if (windowWidth >= 1024) {
        leftNavMain.classList.toggle("hide");
        leftNavMain.classList.remove("show-not-watch");
      } else if (windowWidth < 1024) {
        leftNavMain.classList.toggle("show-not-watch");
        leftNavMain.classList.remove("hide");
      }
    } else if (isWatchPage) {
      leftNavMain.classList.toggle("show");
    }
  };
};
