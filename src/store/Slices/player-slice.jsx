import { createSlice } from "@reduxjs/toolkit";

const playerSlicer = createSlice({
  name: "player",
  initialState: {
    currentPanel: "settings-menu-selector-items",
    panel: -1,
    preferredResolution: false,
    resolution: "144p",
    settingsShowing: false,
  },
  reducers: {
    updateResolution: (state, action) => {
      state.resolution = action.payload;
    },
    updateSettingsShowing: (state, action) => {
      state.settingsShowing = !state.settingsShowing;
    },
    updatePreferredRes: (state, action) => {
      state.preferredResolution = action.payload;
    },
    updatePanel: (state, action) => {
      state.panel = action.payload;
    },
    updateCurrentPanel: (state, action) => {
      state.currentPanel = action.payload;
    },
  },
});

export const { updateResolution, updateSettingsShowing, updatePreferredRes, updatePanel, updateCurrentPanel } = playerSlicer.actions;
export default playerSlicer.reducer;

export const handleTranslating = (panel, currentElement, element) => {
  return (dispatch) => {
    dispatch(updateCurrentPanel(element));
    const settingsRef = document.querySelector(".settings");
    const settingsScrollContainer = document.querySelector(".settings-inner");
    if (typeof panel === "number") {
      dispatch(updatePanel(panel));
    }
    const currentEl = document.querySelector(`.${currentElement}`);

    // if (currentEl) {
    //   const { width } = currentEl.getBoundingClientRect();
    //   currentEl.style.minWidth = `${width}px`;
    // }

    setTimeout(() => {
      const targetEl = document.querySelector(`.${element}`);

      const { width, height } = targetEl.getBoundingClientRect();
      const targetLeft = targetEl.offsetLeft;
      settingsRef.style.width = `${width}px`;
      settingsRef.style.height = `${height}px`;
      settingsScrollContainer.style.width = `${width}px`;
      settingsScrollContainer.style.height = `${height}px`;
      settingsScrollContainer.style.transform = `translate(-${targetLeft}px, 0px)`;

      setTimeout(() => {
        if (typeof panel !== "number") {
          dispatch(updatePanel(-4));
        }
      }, 460);
    }, 10);
  };
};
