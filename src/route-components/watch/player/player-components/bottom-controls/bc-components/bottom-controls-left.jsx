import { useLayoutEffect } from "react";
import { ForwardButton, PlayPauseButton } from "../../../../../../assets/icons";
import { usePlayerMouseMove } from "../../../utilities/player-mouse-interactions";
import VolumeSlider from "./slider";
import { getTimeStamp, removeLeadingZero } from "../../../../../../utilities/getTimestamp";
import { useSelector } from "react-redux";

export const BottomControlsLeft = ({ handlePlayState }) => {
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const { duration_timestamp } = playingVideo;
  const [handleMouseMove] = usePlayerMouseMove();
  const handleMouseLeaveControlsLeft = (e) => {
    const volumeForm = document.querySelector(".volume-slider");
    volumeForm.classList.remove("show");
  };

  const updateTime = () => {
    const videoRef = document.querySelector("#html5-player");
    const timeContainer = document.querySelector(".time-left-container");
    const currentTime = videoRef.currentTime;

    const timeStamp = getTimeStamp(parseInt(currentTime));
    timeContainer.textContent = timeStamp;
  };

  useLayoutEffect(() => {
    const videoRef = document.querySelector("#html5-player");

    videoRef.addEventListener("timeupdate", updateTime);

    return () => {
      videoRef.removeEventListener("timeupdate", updateTime);
    };
  }, [playingVideo]);
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
    </div>
  );
};
