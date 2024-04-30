import { useDispatch, useSelector } from "react-redux";
import { handleTranslating, updateSubtitles } from "../../../../../../../../store/Slices/player-slice";
import { ArrowLeftButton, TickIcon } from "../../../../../../../../assets/icons";
import SubOptions from "./options";

export const Subtitles = () => {
  const dispatch = useDispatch();
  const subtitles = useSelector((state) => state.player.subtitles);

  const updateSubs = (sub) => {
    dispatch(updateSubtitles(sub));
    dispatch(handleTranslating(0, "subs-inner", "settings-menu-selector-items"));
  };
  const subs = ["English (UK)", "English (auto-generated)"];
  const subEls = subs.map((sub, index) => {
    return (
      <div className='sub-item' onClick={() => updateSubs(sub)} key={`${sub}-${index}`}>
        <p className='tick-container'>{subtitles === sub && <TickIcon />}</p>
        <p>{sub}</p>
      </div>
    );
  });
  return (
    <div className='subtitles-panel menu-panel'>
      <div className='subs-inner'>
        <div className='subtitles-panel-upper settings-upper'>
          <div className='subtitles-panel-upper-left' onClick={() => dispatch(handleTranslating(0, "subs-inner", "settings-menu-selector-items"))}>
            <ArrowLeftButton />
            <p>Subtitles/CC</p>
          </div>
          <p className='custom-handler options' onClick={() => dispatch(handleTranslating(0, "subs-inner", "subs-options-styles"))}>
            options
          </p>
        </div>
        <div className='panel-selector-elements'>{subEls}</div>
        <div className='settings-lower'>
          <p> This setting only applies to the current video.</p>
          <p>
            Adjust caption visibility in <span>Settings</span> for all videos.
          </p>
        </div>
      </div>
      <SubOptions />
    </div>
  );
};
