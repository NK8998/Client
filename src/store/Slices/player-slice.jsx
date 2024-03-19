import { createSlice } from "@reduxjs/toolkit";

const playerSlicer = createSlice({
  name: "player",
  initialState: {
    currentPanel: "settings-menu-selector-items",
    panel: -1,
    preferredResolution: false,
    resolution: "144p",
    settingsShowing: false,
    subtitles: "off",
  },
  reducers: {
    updateResolution: (state, action) => {
      state.resolution = action.payload;
    },
    updateSettingsShowing: (state, action) => {
      state.settingsShowing = action.payload;
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
    updateSubtitles: (state, action) => {
      state.subtitles = action.payload;
    },
  },
});

export const { updateResolution, updateSettingsShowing, updatePreferredRes, updatePanel, updateCurrentPanel, updateSubtitles } = playerSlicer.actions;
export default playerSlicer.reducer;

let timeout1;
let timeout2;
export const handleTranslating = (panel, currentElement, element) => {
  return (dispatch) => {
    if (timeout1) {
      clearTimeout(timeout1);
    }
    if (timeout2) {
      clearTimeout(timeout2);
    }
    dispatch(updateCurrentPanel(element));
    const settingsRef = document.querySelector(".settings");
    const settingsScrollContainer = document.querySelector(".settings-inner");
    if (typeof panel === "number") {
      dispatch(updatePanel(panel));
    }

    // const currentEl = document.querySelector(`.${currentElement}`);

    // if (currentEl) {
    //   const { width } = currentEl.getBoundingClientRect();
    //   currentEl.style.minWidth = `${width}px`;
    // }

    timeout1 = setTimeout(() => {
      const panelEl = document.querySelectorAll(".panel-item");

      panelEl.forEach((panelel) => {
        panelel.classList.remove("panel-hidden");
      });
      const targetEl = document.querySelector(`.${element}`);
      const { width, height } = targetEl.getBoundingClientRect();
      const targetLeft = targetEl.offsetLeft;
      if (currentElement === element) {
        settingsRef.style.transition = `all 0ms`;
        settingsScrollContainer.style.transition = `all 0ms`;
      } else if (currentElement !== element) {
        settingsRef.style.transition = `height 200ms ease, width 200ms ease, opacity 100ms ease`;

        settingsScrollContainer.style.transition = `all 200ms ease`;
      }
      settingsRef.style.width = `${width}px`;
      settingsRef.style.height = `${height}px`;
      // settingsScrollContainer.style.width = `${width}px`;
      settingsScrollContainer.style.height = `${height}px`;

      settingsScrollContainer.style.transform = `translate(-${targetLeft}px, 0px)`;
      if (currentElement === element) {
        const panelEl = document.querySelectorAll(".panel-item");

        panelEl.forEach((panelel) => {
          if (!panelel.classList.contains(element)) {
            panelel.classList.add("panel-hidden");
          }
        });
      }
      timeout2 = setTimeout(() => {
        if (typeof panel !== "number") {
          dispatch(updatePanel(-4));
        }
        // const panelEl = document.querySelectorAll(".panel-item");

        // panelEl.forEach((panelel) => {
        //   if (!panelel.classList.contains(element)) {
        //     panelel.classList.add("panel-hidden");
        //   }
        // });
      }, 200);
    }, 5);
  };
};

export const handleTranslatingHere = (panel, currentElement, element) => {
  return (dispatch) => {
    const settingsRef = document.querySelector(".settings");
    const settingsScrollContainer = document.querySelector(".settings-inner");

    settingsScrollContainer.style.transition = `all 0ms`;
    settingsRef.style.transition = `all 0ms`;
    settingsScrollContainer.style.transform = `translate(-${0}px, 0px)`;

    const panelEl = document.querySelectorAll(".panel-item");

    panelEl.forEach((panelel) => {
      if (!panelel.classList.contains(element)) {
        panelel.classList.add("panel-hidden");
      }
    });

    setTimeout(() => {
      if (typeof panel === "number") {
        dispatch(updatePanel(panel));
      }
      const targetEl = document.querySelector(`.${element}`);
      const { width, height } = targetEl.getBoundingClientRect();
      const targetLeft = targetEl.offsetLeft;
      if (currentElement === element) {
        settingsRef.style.transition = `all 0ms`;
        settingsScrollContainer.style.transition = `all 0ms`;
      } else if (currentElement !== element) {
        settingsRef.style.transition = `height 200ms ease, width 200ms ease, opacity 100ms ease`;

        settingsScrollContainer.style.transition = `all 200ms ease`;
      }
      settingsRef.style.width = `${width}px`;
      settingsRef.style.height = `${height}px`;
      // settingsScrollContainer.style.width = `${width}px`;
      settingsScrollContainer.style.height = `${height}px`;

      settingsScrollContainer.style.transform = `translate(-${targetLeft}px, 0px)`;
    }, 5);
  };
};
