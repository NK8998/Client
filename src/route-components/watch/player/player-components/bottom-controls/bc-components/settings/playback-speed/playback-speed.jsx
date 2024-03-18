import { useDispatch } from "react-redux";
import { ArrowLeftButton } from "../../../../../../../../assets/icons";
import { handleTranslating } from "../../../../../../../../store/Slices/player-slice";
import { CustomSpeed } from "./custom";

export const PlayBackSpeed = ({}) => {
  const dispatch = useDispatch();

  const speed = [0.25, 0.5, 0.75, "Normal", 1.25, 1.5, 1.75, 2];

  const items = speed.map((option, index) => {
    return (
      <div className='speed-option' key={`${option}-${index}`}>
        <p className='tick-container'></p>
        {option}
      </div>
    );
  });
  return (
    <div className='play-back-speed-outer '>
      <div className='playback-speed-panel menu-panel panel-item'>
        <div className='playback-speed-upper'>
          <div
            className='playback-speed-upper-left'
            onClick={() => dispatch(handleTranslating(null, "playback-speed-panel", "settings-menu-selector-items"))}
          >
            <ArrowLeftButton />
            <p>Playback speed</p>
          </div>
          <p className='custom-handler' onClick={() => dispatch(handleTranslating(1, "playback-speed-panel", "custom-speed"))}>
            custom
          </p>
        </div>
        <div className='playback-speed-panel-options'>{items}</div>
      </div>
      <CustomSpeed />
    </div>
  );
};
