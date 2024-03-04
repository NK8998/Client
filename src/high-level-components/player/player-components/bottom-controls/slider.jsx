import * as Slider from "@radix-ui/react-slider";
import { usePlayerMouseMove } from "../../utilities/player-mouse-interactions";
import { useRef, useState } from "react";
import { VolumeHighButton, VolumeLowButton, VolumeMuteButton } from "../../../../assets/icons";

export default function VolumeSlider({ handleFocus }) {
  const [handleMouseMove] = usePlayerMouseMove();
  const [volume, setVolume] = useState(1);
  const currentVolume = useRef(1);
  const sliderThumbLeft = useRef(`calc(100% - 6px)`);
  const sliderThumbRef = useRef();
  const sliderTrackRef = useRef();
  const hoveringRef = useRef();

  const hanldeValueChange = (value) => {
    const videoRef = document.querySelector("#html5-player");
    if (!videoRef) return;
    handleMouseMove();
    const volume = value[0] / 100;
    setVolume(volume);
    currentVolume.current = volume;
    videoRef.volume = volume;
    const parent = document.querySelector(".SliderThumb").parentNode;
    const left = parent.style.left;
    sliderThumbLeft.current = left;
  };

  let volumeIcon = <></>;
  if (volume >= 0.5) {
    volumeIcon = <VolumeHighButton />;
  } else if (volume < 0.5 && volume > 0) {
    volumeIcon = <VolumeLowButton />;
  } else if (volume === 0) {
    volumeIcon = <VolumeMuteButton />;
  }

  const handleMouseEnter = () => {
    handleFocus();
    hoveringRef.current = true;
    const volumeForm = document.querySelector(".volume-slider");
    volumeForm.classList.add("show");
  };
  const handleMouseLeavePlayerButton = () => {
    hoveringRef.current = false;
  };
  const handleBlur = (e) => {
    if (hoveringRef.current === true) return;
    const volumeForm = document.querySelector(".volume-slider");
    volumeForm.classList.remove("show");
  };

  const handleMuteUnmute = () => {
    const videoRef = document.querySelector("#html5-player");
    const sliderThumb = document.querySelector(".SliderThumb");
    const parent = sliderThumb.parentNode;
    const sliderWidth = sliderThumbRef.current.clientWidth / 2;

    if (!videoRef) return;
    if (volume > 0) {
      setVolume(0);
      videoRef.volume = 0;
      parent.style.left = `calc(0% + ${sliderWidth}px)`;
    } else if (volume === 0) {
      setVolume(currentVolume.current);
      videoRef.volume = currentVolume.current;
      parent.style.left = `${sliderThumbLeft.current}`;
    }
  };

  return (
    <>
      <button
        type='button'
        className='player-button volume'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeavePlayerButton}
        onFocus={handleFocus}
        onClick={handleMuteUnmute}
      >
        {volumeIcon}
      </button>
      <form className='volume-slider player-button' tabIndex={0} onFocus={handleMouseEnter} onBlur={handleBlur}>
        <Slider.Root className='SliderRoot' value={[volume * 100]} defaultValue={[100]} max={100} min={0} step={1} onValueChange={hanldeValueChange}>
          <Slider.Track className='SliderTrack' ref={sliderTrackRef}>
            <Slider.Range className='SliderRange' />
          </Slider.Track>
          <Slider.Thumb className='SliderThumb' aria-label='Volume' ref={sliderThumbRef} />
        </Slider.Root>
      </form>
    </>
  );
}
