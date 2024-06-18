import { createSlice } from "@reduxjs/toolkit";

const playerSlicer = createSlice({
  name: "player",
  initialState: {
    play: false,
    chapters: [{ start: 0, title: "", end: 50 }],
    currentPanel: "settings-menu-selector-items",
    panel: -1,
    preferredResolution: false,
    resolution: "144p",
    settingsShowing: false,
    subtitles: "Off",
    buffering: false,
    isDragging: true,
    urlTime: 0,
    seeking: false,
    playbackRate: 1,
    currentIndex: 0,
  },
  reducers: {
    updatePlayerState: (state, action) => {
      const { playerPropertyToUpdate, updatedValue } = action.payload;
      state[playerPropertyToUpdate] = updatedValue;
    },
  },
});

export const { updatePlayerState } = playerSlicer.actions;
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
    dispatch(updatePlayerState({ playerPropertyToUpdate: "currentPanel", updatedValue: element }));
    const settingsRef = document.querySelector(".settings");
    const settingsScrollContainer = document.querySelector(".settings-inner");
    if (typeof panel === "number") {
      dispatch(updatePlayerState({ playerPropertyToUpdate: "panel", updatedValue: panel }));
    }
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
      }
      settingsRef.style.transition = `height 200ms ease, width 200ms ease, opacity 100ms ease`;

      settingsScrollContainer.style.transition = `all 200ms ease`;

      settingsRef.style.width = `${width}px`;
      settingsRef.style.height = `${height}px`;
      // settingsScrollContainer.style.width = `${width}px`;
      settingsScrollContainer.style.height = `${height}px`;

      settingsScrollContainer.style.transform = `translate(-${targetLeft}px, 0px)`;
      timeout2 = setTimeout(() => {
        if (typeof panel !== "number") {
          dispatch(updatePlayerState({ playerPropertyToUpdate: "panel", updatedValue: -4 }));
        }
      }, 200);
    }, 5);
  };
};

export const handleTranslatingHere = (panel = 0, currentElement, element = "settings-menu-selector-items") => {
  return (dispatch) => {
    const settingsRef = document.querySelector(".settings");
    const settingsScrollContainer = document.querySelector(".settings-inner");

    settingsScrollContainer.style.transition = `all 0ms`;
    settingsRef.style.transition = `all 0ms`;

    const panelEl = document.querySelectorAll(".panel-item");

    panelEl.forEach((panelel) => {
      if (!panelel.classList.contains(element)) {
        panelel.classList.add("panel-hidden");
      }
    });

    requestAnimationFrame(() => {
      if (typeof panel === "number") {
        dispatch(updatePlayerState({ playerPropertyToUpdate: "panel", updatedValue: panel }));
      }
      const targetEl = document.querySelector(`.${element}`);
      const { width, height } = targetEl.getBoundingClientRect();
      const targetLeft = targetEl.offsetLeft;
      settingsScrollContainer.style.transform = `translate(-${targetLeft}px, 0px)`;

      settingsRef.style.width = `${width}px`;
      settingsRef.style.height = `${height}px`;
      // settingsScrollContainer.style.width = `${width}px`;
      settingsScrollContainer.style.height = `${height}px`;
    });
  };
};

export const toggleCaptions = (playerRef, captions_url, subLanguage = "English (auto-generated)") => {
  return (dispatch, getState) => {
    if (!captions_url) return;

    const captionsButton = document.querySelector(".player-button.captions");

    if (captions_url !== "Off") {
      playerRef.current
        .addTextTrackAsync(captions_url, "en", "subtitles", "text/vtt")
        .then(function () {
          console.log("Subtitle track added");
        })
        .catch(function (error) {
          console.error("Error adding subtitle track:", error);
        });
    }

    const visibility = playerRef.current.isTextTrackVisible();
    playerRef.current.setTextTrackVisibility(!visibility);
    if (visibility || captions_url === "Off") {
      dispatch(updatePlayerState({ playerPropertyToUpdate: "subtitles", updatedValue: "Off" }));
      captionsButton.classList.remove("captions-on");
    } else {
      dispatch(updatePlayerState({ playerPropertyToUpdate: "subtitles", updatedValue: subLanguage }));
      captionsButton.classList.add("captions-on");
    }
  };
};

export const removeCaptions = (playerRef) => {
  // Reset the captions
  if (playerRef.current) {
    const tracks = playerRef.current.getTextTracks();
    console.log(tracks);
    tracks.forEach((track) => {
      if (track.kind === "subtitles") {
        track.active = false;
      }
      console.log("tracks removed");
    });
    // Set text track visibility to false
    playerRef.current.setTextTrackVisibility(false);
  }
};
