import { useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { usePlayerScrubbingBarInteractions } from "../../utilities/player-scrubbingBar-logic";
import { debounce } from "lodash";

export default function PreviewBG() {
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const buffering = useSelector((state) => state.player.buffering);
  const debounceTime = useSelector((state) => state.app.debounceTime);
  const [updateScrubbingBar, previewCanvas, movePreviews, retrieveCurPalleteAndTile] = usePlayerScrubbingBarInteractions();
  const { aspect_ratio } = playingVideo;

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
    console.log("I ran in calculateDimensions function");
  };

  useLayoutEffect(() => {
    const debouncedVer = debounce(calculateDimensions, 5);
    debouncedVer();
  }, [fullScreen, theatreMode, miniPlayer]);

  useLayoutEffect(() => {
    const debouncedVer = debounce(calculateDimensions, debounceTime + 5);
    window.addEventListener("resize", debouncedVer);

    return () => {
      window.removeEventListener("resize", debouncedVer);
    };
  }, [buffering, fullScreen, theatreMode, miniPlayer]);
  return (
    <div className='preview-image-bg-container'>
      <div className='preview-bg-relative'>
        <div className='preview-image-bg' />
      </div>
    </div>
  );
}
