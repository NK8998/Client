import { useSelector } from "react-redux";
import { PlayBackSpeed } from "./playback-speed/playback-speed";
import { Resolutions } from "./resolutions/resolutions";
import { Subtitles } from "./subtitles/subtitles";

export const PanelHandler = ({ playerRef, checkBufferedOnTrackChange }) => {
  const panel = useSelector((state) => state.player.panel);
  const panels = [
    { panel: 0, component: <Subtitles /> },
    { panel: 1, component: <PlayBackSpeed /> },
    {
      panel: 2,
      component: <Resolutions playerRef={playerRef} checkBufferedOnTrackChange={checkBufferedOnTrackChange} />,
    },
  ];

  const panelRendered = panels.find((panelComponent) => panelComponent.panel === panel) || <></>;
  return (
    <div className='panel-handler'>
      <div className='panel-inner'>{panelRendered.component}</div>
    </div>
  );
};
