import { useSelector } from "react-redux";

import "./settings.css";
import { PanelHandler } from "./panel-handler";
import { useLayoutEffect, useRef } from "react";
import { AmbientModeMenu, AnnotationsMenu, PlayBackMenu, QualityMenu, SubtitlesMenu } from "./menu-items/menu-items";

export default function Settings({ playerRef, checkBufferedOnTrackChange }) {
  const location = useSelector((state) => state.app.location);
  const settingsRef = useRef();
  const settingsScrollContainer = useRef();
  const mainSettingsRef = useRef();
  const setCurrentElement = () => {
    if (!location.includes("watch")) return;
    const { width, height } = mainSettingsRef.current.getBoundingClientRect();

    settingsRef.current.style.width = `${width}px`;
    settingsRef.current.style.height = `${height}px`;
    settingsScrollContainer.current.style.width = `${width}px`;
    settingsScrollContainer.current.style.height = `${height}px`;
  };

  useLayoutEffect(setCurrentElement, [location]);

  return (
    <>
      <div className={`settings`} ref={settingsRef}>
        <div className='settings-inner' ref={settingsScrollContainer}>
          <div className='settings-menu-selector-items' ref={mainSettingsRef}>
            <AmbientModeMenu />
            <AnnotationsMenu />
            <SubtitlesMenu />
            <PlayBackMenu />
            <QualityMenu />
          </div>
          <div className='setting-items'>
            <PanelHandler playerRef={playerRef} checkBufferedOnTrackChange={checkBufferedOnTrackChange} />
          </div>
        </div>
      </div>
      <div className='settings-clikcregion'></div>
    </>
  );
}
