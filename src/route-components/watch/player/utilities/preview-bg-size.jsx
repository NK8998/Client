import { useEffect, useRef } from "react";
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
  const [startDrag, stopDragging, handleClick, handleDrag, updateRedDot, resetDot, isDragging] = usePlayerDraggingLogic();

  const timeoOutRef = useRef();
  const recalculateDimensions = () => {
    if (!buffering) return;
    const previewImageBg = document.querySelector(".preview-image-bg");
    previewImageBg.style.visibility = "hidden";

    if (timeoOutRef.current) {
      clearTimeout(timeoOutRef.current);
    }

    timeoOutRef.current = setTimeout(() => {
      if (!aspect_ratio) return;
      const playerOuter = document.querySelector(".player-outer");
      const videoRef = document.querySelector("#html5-player");

      if (!previewImageBg || !playerOuter) return;

      let height;
      let width;
      if (!theatreMode) {
        // height = parseInt(style.getPropertyValue("--height").split("px")[0]);
        // width = parseInt(style.getPropertyValue("--width").split("px")[0]);
        const dimensions = playerOuter.getBoundingClientRect();
        width = dimensions.width;
        height = dimensions.height;
      } else if (theatreMode) {
        // const theatreHeight = parseInt(style.getPropertyValue("--theatreHeight").split("px")[0]);
        // const theatreWidth = parseInt(style.getPropertyValue("--theatreWidth").split("px")[0]);
        const dimensions = playerOuter.getBoundingClientRect();
        const theatreWidth = dimensions.width;
        const theatreHeight = dimensions.height;
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
        const dimensions = playerOuter.getBoundingClientRect();
        // width = parseInt(style.getPropertyValue("--theatreWidth").split("px")[0]);
        width = dimensions.width;
        height = width * (1 / aspect_ratio);
      }
      previewImageBg.style.height = `${height}px`;
      previewImageBg.style.width = `${width}px`;
      const currentTime = videoRef.currentTime;
      const dimensions = { width: width, height: height };

      retrieveCurPalleteAndTile(currentTime, previewImageBg, dimensions);
      previewImageBg.style.visibility = "visible";
    }, 5);
  };

  useEffect(recalculateDimensions, [fullScreen, theatreMode, miniPlayer, isDragging.current]);

  useEffect(() => {
    window.addEventListener("resize", recalculateDimensions);

    return () => {
      window.removeEventListener("resize", recalculateDimensions);
    };
  }, []);

  return <></>;
};
