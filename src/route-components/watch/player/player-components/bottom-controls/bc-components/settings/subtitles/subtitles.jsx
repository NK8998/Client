import { useDispatch, useSelector } from "react-redux";
import { handleTranslating, toggleCaptions, updateSubtitles } from "../../../../../../../../store/Slices/player-slice";
import { ArrowLeftButton, TickIcon } from "../../../../../../../../assets/icons";
import SubOptions from "./options";

export const Subtitles = ({ playerRef }) => {
  const dispatch = useDispatch();
  const subtitles = useSelector((state) => state.player.subtitles);
  const { captions_url } = useSelector((state) => state.watch.playingVideo);

  const updateSubs = (url, language) => {
    dispatch(updateSubtitles(language));
    dispatch(handleTranslating(0, "subs-inner", "settings-menu-selector-items"));
    if (subtitles !== "Off") return;
    dispatch(toggleCaptions(playerRef, url, language));
  };
  if (!captions_url) return <></>;

  const subEls = captions_url.map((sub, index) => {
    return (
      <div className='sub-item' onClick={() => updateSubs(sub.url, sub.language)} key={`${sub.language}-${index}`}>
        <p className='tick-container'>{subtitles === sub.language && <TickIcon />}</p>
        <p>{sub.language}</p>
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
