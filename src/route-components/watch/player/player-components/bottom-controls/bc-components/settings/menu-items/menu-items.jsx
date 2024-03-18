import { useDispatch, useSelector } from "react-redux";
import {
  AmbientModeButton,
  AnnotationsButton,
  ArrowRightButton,
  PlaybackSpeedButton,
  QualityCogButton,
  SubtitlesButton,
} from "../../../../../../../../assets/icons";
import { handleTranslating } from "../../../../../../../../store/Slices/player-slice";

export const AmbientModeMenu = ({}) => {
  return (
    <div className='ambient-mode-button settings-button'>
      <div className='settings-button-left'>
        <AmbientModeButton />
        <p>Ambient Mode</p>
      </div>
      <div className='settings-button-right'></div>
    </div>
  );
};

export const AnnotationsMenu = ({}) => {
  return (
    <div className='annotations-button settings-button'>
      <div className='settings-button-left'>
        <AnnotationsButton />
        <p>Annotations</p>
      </div>
      <div className='settings-button-right'></div>
    </div>
  );
};

export const SubtitlesMenu = ({}) => {
  const dispatch = useDispatch();
  const subtitles = useSelector((state) => state.player.subtitles);

  return (
    <div
      className='subtitles-button settings-button'
      onClick={() => dispatch(handleTranslating(0, "settings-menu-selector-items", "subtitles-panel"))}
    >
      <div className='settings-button-left'>
        <SubtitlesButton />
        <p>Subtitles/CC</p>
      </div>
      <div className='settings-button-right'>
        <p>{subtitles}</p>
        <ArrowRightButton />
      </div>
    </div>
  );
};

export const PlayBackMenu = ({}) => {
  const dispatch = useDispatch();

  return (
    <div
      className='playback-button settings-button'
      onClick={() => dispatch(handleTranslating(1, "settings-menu-selector-items", "playback-speed-panel"))}
    >
      <div className='settings-button-left'>
        <PlaybackSpeedButton />
        <p>Playback speed</p>
      </div>
      <div className='settings-button-right'>
        <p>Normal</p>
        <ArrowRightButton />
      </div>
    </div>
  );
};

export const QualityMenu = ({}) => {
  const dispatch = useDispatch();
  const resolution = useSelector((state) => state.player.resolution);
  const preferredResolution = useSelector((state) => state.player.preferredResolution);
  return (
    <div
      className='quality-button settings-button'
      onClick={() => dispatch(handleTranslating(2, "settings-menu-selector-items", "resolutions-settings"))}
    >
      <div className='settings-button-left'>
        <QualityCogButton />
        <p>Quality</p>
      </div>
      <div className='settings-button-right'>
        {preferredResolution ? <p>{resolution}</p> : <p>Auto({resolution})</p>}
        <ArrowRightButton />
      </div>
    </div>
  );
};
