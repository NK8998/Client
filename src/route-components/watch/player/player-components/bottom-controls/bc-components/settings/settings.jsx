import { useDispatch, useSelector } from "react-redux";

import "./settings.css";
import { PanelHandler } from "./panel-handler";
import { useLayoutEffect, useRef } from "react";
import { AmbientModeMenu, AnnotationsMenu, PlayBackMenu, QualityMenu, SubtitlesMenu } from "./menu-items/menu-items";
import { handleTranslatingHere } from "../../../../../../../store/Slices/player-slice";

export default function Settings({ playerRef, checkBufferedOnTrackChange }) {
  const dispatch = useDispatch();
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const { captions_url } = playingVideo;
  const location = useSelector((state) => state.app.location);
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const currentPanel = useSelector((state) => state.player.currentPanel);
  const panel = useSelector((state) => state.player.panel);
  const settingsRef = useRef();
  const settingsScrollContainer = useRef();
  const mainSettingsRef = useRef();
  const setCurrentElement = () => {
    if (!location.includes("watch")) return;
    const { width, height } = mainSettingsRef.current.getBoundingClientRect();

    settingsRef.current.style.width = `${width}px`;
    settingsRef.current.style.height = `${height}px`;
    // settingsScrollContainer.current.style.width = `${width}px`;
    settingsScrollContainer.current.style.height = `${height}px`;
  };

  useLayoutEffect(setCurrentElement, [location]);

  useLayoutEffect(() => {
    dispatch(handleTranslatingHere(panel, currentPanel, currentPanel));
  }, [fullScreen]);

  useLayoutEffect(() => {
    dispatch(handleTranslatingHere(panel, currentPanel, currentPanel));
  }, [playingVideo]);

  return (
    <>
      <div className={`settings ${!location.includes("watch") ? "settings-hidden" : ""}`} ref={settingsRef}>
        <div className='settings-inner' ref={settingsScrollContainer}>
          <div className='settings-menu-selector-items panel-item' ref={mainSettingsRef}>
            <AmbientModeMenu />
            <AnnotationsMenu />
            {captions_url && <SubtitlesMenu />}
            {/* <SubtitlesMenu /> */}
            <PlayBackMenu />
            <QualityMenu />
          </div>
          <div className='setting-items'>
            <PanelHandler playerRef={playerRef} checkBufferedOnTrackChange={checkBufferedOnTrackChange} />
          </div>
        </div>
      </div>
      <div className={`settings-clikcregion ${!location.includes("watch") ? "settings-hidden" : ""}`}></div>
    </>
  );
}
