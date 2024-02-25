import { useDispatch, useSelector } from "react-redux";
import { FullscreenButton, PlayPauseButton, SmallScreenButton, TheatreNormalButton } from "../../../../assets/icons";
import { handleFullscreen, handleTheatre } from "../../../../store/Slices/watch-slice";
import { useLayoutEffect } from "react";
import { handleFocusingElements } from "../../utilities/player-progressBar-logic";

export default function BottomControls({ handlePlayState, isFocusing, handleMouseMove }) {
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const dispatch = useDispatch();

  const handleKeyUp = (e) => {
    const key = e.key.toLowerCase();
    const target = e.target;

    if (key === "tab" && target.classList.contains("player-button")) {
      handleMouseMove();
      handleFocusingElements(isFocusing);
      const selector = target.classList.value.split(" ")[1];
      const button = document.querySelector(`.${selector}`);
      button.classList.add("focused");
    } else if (key !== "tab" && !target.classList.contains("player-button")) {
      const playerButtons = document.querySelectorAll(".player-button");
      playerButtons.forEach((playerButton) => {
        playerButton.classList.remove("focused");
      });
    }
  };
  useLayoutEffect(() => {
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  const handleBlur = (e) => {
    e.target.classList.remove("focused");
    handleFocusingElements(isFocusing);
  };

  return (
    <div className='bottom-controls'>
      <div className='bottom-controls-left'>
        <button type='button' className={`player-button play-pause`} onClick={handlePlayState} onBlur={handleBlur}>
          <PlayPauseButton />
        </button>
      </div>
      <div className='bottom-controls-right'>
        <button type='button' className='player-button theatre-normal' onClick={() => dispatch(handleTheatre(theatreMode))} onBlur={handleBlur}>
          <TheatreNormalButton />
        </button>
        <button type='button' className='player-button fullscreen-normal' onClick={() => dispatch(handleFullscreen(fullScreen))} onBlur={handleBlur}>
          {fullScreen ? <SmallScreenButton /> : <FullscreenButton />}
        </button>
      </div>
    </div>
  );
}
