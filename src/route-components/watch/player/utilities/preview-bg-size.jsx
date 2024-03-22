import { useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { usePlayerScrubbingBarInteractions } from "./player-scrubbingBar-logic";
import { usePlayerDraggingLogic } from "./player-dragging-logic";

export const PreviewBgSize = () => {
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const buffering = useSelector((state) => state.player.buffering);
  const [updateScrubbingBar, previewCanvas, movePreviews, retrieveCurPalleteAndTile] = usePlayerScrubbingBarInteractions();
  const { aspect_ratio } = playingVideo;

  const timeoOutRef = useRef();

  const calculateDimensions = () => {
    if (!buffering) return;
    const previewImageBg = document.querySelector(".preview-image-bg");
    const prieviewBGShowing = previewImageBg.classList.contains("show");
    if (!prieviewBGShowing) return;

    const style = getComputedStyle(document.documentElement);
    if (!aspect_ratio) return;
    const playerOuter = document.querySelector(".player-outer");
    const videoRef = document.querySelector("#html5-player");
    if (!previewImageBg || !playerOuter) return;
    let height;
    let width;
    if (!theatreMode) {
      height = parseInt(style.getPropertyValue("--height").split("px")[0]);
      width = parseInt(style.getPropertyValue("--width").split("px")[0]);
      // const dimensions = playerOuter.getBoundingClientRect();
      // width = dimensions.width;
      // height = dimensions.height;
    } else if (theatreMode) {
      const theatreHeight = parseInt(style.getPropertyValue("--theatreHeight").split("px")[0]);
      const theatreWidth = parseInt(style.getPropertyValue("--theatreWidth").split("px")[0]);
      // const dimensions = playerOuter.getBoundingClientRect();
      // const theatreWidth = dimensions.width;
      // const theatreHeight = dimensions.height;
      height = theatreWidth * aspect_ratio;
      width = theatreHeight * aspect_ratio;
      if (width > theatreWidth) {
        width = theatreWidth;
        height = width * (1 / aspect_ratio);
      }
      if (height > theatreHeight) {
        height = theatreHeight;
      }
    }
    if (miniPlayer) {
      width = 400;
      height = 400 * (1 / aspect_ratio);
    }
    if (fullScreen) {
      // const dimensions = playerOuter.getBoundingClientRect();
      width = window.innerWidth;
      // width = dimensions.width;
      height = width * (1 / aspect_ratio);
    }
    previewImageBg.style.height = `${height}px`;
    previewImageBg.style.width = `${width}px`;
    const currentTime = videoRef.currentTime;
    const dimensions = { width: width, height: height };
    retrieveCurPalleteAndTile(currentTime, previewImageBg, dimensions);
    previewImageBg.classList.add("show");
  };

  useLayoutEffect(calculateDimensions, [fullScreen, theatreMode, miniPlayer]);

  useLayoutEffect(() => {
    const callerFunc = () => {
      if (timeoOutRef.current) {
        clearTimeout(timeoOutRef.current);
      }
      timeoOutRef.current = setTimeout(() => {
        calculateDimensions();
      }, 5);
    };
    window.addEventListener("resize", callerFunc);

    return () => {
      window.removeEventListener("resize", callerFunc);
    };
  }, [buffering, fullScreen]);

  return <></>;
};
