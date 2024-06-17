import { useEffect, useLayoutEffect } from "react";
import { ArrowRightBottomControls, ForwardButton, PlayPauseButton } from "../../../../../../assets/icons";
import { usePlayerMouseMove } from "../../../utilities/player-mouse-interactions";
import VolumeSlider from "./slider";
import { getTimeStamp, removeLeadingZero } from "../../../../../../utilities/getTimestamp";
import { useSelector } from "react-redux";

export const BottomControlsLeft = ({ handlePlayState }) => {
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const chapters = useSelector((state) => state.player.chapters);

  const { duration_timestamp } = playingVideo;
  const { handleMouseMove } = usePlayerMouseMove();
  const handleMouseLeaveControlsLeft = (e) => {
    const volumeForm = document.querySelector(".volume-slider");
    volumeForm.classList.remove("show");
  };

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const time = params.get("t") || 0;

    const timeContainer = document.querySelector(".time-left-container");
    if (!timeContainer) return;

    const timeStamp = getTimeStamp(Math.round(time));
    timeContainer.textContent = timeStamp;
  }, [playingVideo, location]);

  return (
    <div className='bottom-controls-left' onMouseLeave={handleMouseLeaveControlsLeft}>
      <button type='button' className={`player-button play-pause`} onClick={handlePlayState} onFocus={handleMouseMove}>
        <PlayPauseButton />
      </button>
      <button type='button' className='player-button forward' onFocus={handleMouseMove}>
        <ForwardButton />
      </button>
      <VolumeSlider />
      <div className='time-container'>
        <p className='time-left-container'>0:00</p>
        <p className='time-middle-container'>/</p>
        <p className='time-right-container'>{duration_timestamp && removeLeadingZero(duration_timestamp)}</p>
      </div>
      <button className={`player-button chapter-title ${chapters.length <= 1 ? "single" : ""}`}>
        <div className='floating-dot'></div>
        <p className='chapter-title-container bottom'></p>
        <ArrowRightBottomControls />
      </button>
    </div>
  );
};
