import { useDispatch } from "react-redux";
import { ArrowLeftButton } from "../../../../../../../../assets/icons";
import { handleTranslating } from "../../../../../../../../store/Slices/player-slice";

export const CustomSpeed = ({}) => {
  const dispatch = useDispatch();
  return (
    <div className='custom-speed panel-item'>
      <div className='custom-speed-upper settings-upper' onClick={() => dispatch(handleTranslating(1, "custom-speed", "playback-speed-panel"))}>
        <div className='settings-upper-left'>
          <ArrowLeftButton />
          <p>Custom</p>
        </div>
        <p></p>
      </div>
      <div className='custom-speed-inner'></div>
    </div>
  );
};
