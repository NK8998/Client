import { useDispatch } from "react-redux";
import { ArrowLeftButton } from "../../../../../../../../assets/icons";
import { handleTranslating } from "../../../../../../../../store/Slices/player-slice";

export const CustomSpeed = ({}) => {
  const dispatch = useDispatch();
  return (
    <div className='custom-speed'>
      <div className='custom-speed-upper' onClick={() => dispatch(handleTranslating(1, "custom-speed", "playback-speed-panel"))}>
        <ArrowLeftButton />
        <p>Playback speed</p>
      </div>
      <div className='custom-speed-inner'></div>
    </div>
  );
};
