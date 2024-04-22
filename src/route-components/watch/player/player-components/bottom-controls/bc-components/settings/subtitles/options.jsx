import { useDispatch } from "react-redux";
import { ArrowLeftButton } from "../../../../../../../../assets/icons";
import { handleTranslating } from "../../../../../../../../store/Slices/player-slice";

export default function SubOptions() {
  const dispatch = useDispatch();
  return (
    <div className='subs-options-styles'>
      <div className='subtitles-panel-upper settings-upper'>
        <div className='subtitles-panel-upper-left' onClick={() => dispatch(handleTranslating(0, "subs-options-styles", "subs-inner"))}>
          <ArrowLeftButton />
          <p>Options</p>
        </div>
        <p className='custom-handler options'></p>
      </div>
    </div>
  );
}
