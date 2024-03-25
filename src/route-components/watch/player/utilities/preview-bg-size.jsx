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
  const timeoutRef2 = useRef();

  const calculateDimensions = () => {
    if (!buffering) return;
    const previewImageBg = document.querySelector(".preview-image-bg");
    const prieviewBGShowing = previewImageBg.classList.contains("show");
    if (!prieviewBGShowing) return;
    if (!aspect_ratio) return;
    const videoRef = document.querySelector("#html5-player");
    if (!previewImageBg) return;
    const currentTime = videoRef.currentTime;

    previewCanvas(currentTime);
  };

  useLayoutEffect(() => {
    if (timeoutRef2.current) {
      clearTimeout(timeoutRef2.current);
    }
    timeoutRef2.current = setTimeout(() => {
      calculateDimensions();
    }, 5);
  }, [fullScreen, theatreMode, miniPlayer]);

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
