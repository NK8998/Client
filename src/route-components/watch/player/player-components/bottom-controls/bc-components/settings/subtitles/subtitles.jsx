import { useDispatch, useSelector } from "react-redux";
import { handleTranslating, updateSubtitles } from "../../../../../../../../store/Slices/player-slice";
import { ArrowLeftButton, TickIcon } from "../../../../../../../../assets/icons";

export const Subtitles = () => {
  const dispatch = useDispatch();
  const subtitles = useSelector((state) => state.player.subtitles);

  const updateSubs = (sub) => {
    dispatch(updateSubtitles(sub));
    dispatch(handleTranslating(0, "subtitles-panel", "settings-menu-selector-items"));
  };
  const subs = ["English(UK)", "English(auto-generated)"];
  const subEls = subs.map((sub) => {
    return (
      <div className='sub-item' onClick={() => updateSubs(sub)}>
        <p className='tick-container'>{subtitles === sub && <TickIcon />}</p>
        <p>{sub}</p>
      </div>
    );
  });
  return (
    <div className='subtitles-panel menu-panel'>
      <div className='subs-inner'>
        <div className='subtitles-panel-upper'>
          <div
            className='subtitles-panel-upper-left'
            onClick={() => dispatch(handleTranslating(0, "subtitles-panel", "settings-menu-selector-items"))}
          >
            <ArrowLeftButton />
            <p>Subtitles/CC</p>
          </div>
          <p className='custom-handler options'>options</p>
        </div>
        <div className='subs-inner'>{subEls}</div>
      </div>
    </div>
  );
};
