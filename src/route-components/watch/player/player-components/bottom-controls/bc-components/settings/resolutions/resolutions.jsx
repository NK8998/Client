import { useDispatch, useSelector } from "react-redux";
import { ArrowLeftButton, TickIcon } from "../../../../../../../../assets/icons";
import { useState } from "react";
import { handleTranslating, updatePreferredRes, updateResolution } from "../../../../../../../../store/Slices/player-slice";

export const Resolutions = ({ playerRef, checkBufferedOnTrackChange }) => {
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const resolution = useSelector((state) => state.player.resolution);
  const preferredResolution = useSelector((state) => state.player.preferredResolution);

  const dispatch = useDispatch();
  const { resolutions } = playingVideo;

  const [currentRes, setCurrentRes] = useState();

  const resetGreyBars = () => {
    const greyBars = document.querySelectorAll(".bar.buffer");
    greyBars.forEach((bar) => {
      bar.style.width = `0%`;
    });
  };

  function changeResolution(resolution, tag, framerate) {
    if (resolution === currentRes) return;
    setCurrentRes(resolution);

    if (resolution === "auto") {
      console.log("ran");
      const currentConfig = playerRef.current.getConfiguration();
      const updatedAbrConfig = {
        ...currentConfig.abr,
        enabled: true, // Enable ABR
      };

      // Update the player's configuration
      playerRef.current.configure({
        ...currentConfig,
        abr: updatedAbrConfig,
      });
      dispatch(updatePreferredRes(false));
      checkBufferedOnTrackChange();
    } else {
      const currentConfig = playerRef.current.getConfiguration();
      const updatedAbrConfig = {
        ...currentConfig.abr,
        enabled: false, // disable ABR
      };

      // Update the player's configuration
      playerRef.current.configure({
        ...currentConfig,
        abr: updatedAbrConfig,
      });

      // Get available tracks (adaptation sets)
      const tracks = playerRef.current.getVariantTracks();

      // Find the track with the desired resolution
      const selectedTrack = tracks.find((track) => {
        return track.height === parseInt(resolution);
      });

      // Select the desired track
      if (selectedTrack) {
        playerRef.current.selectVariantTrack(selectedTrack, true);
        dispatch(updatePreferredRes(true));
        const tagString = `${tag}${framerate > 30 ? framerate : ""}`;
        dispatch(updateResolution(tagString));
        checkBufferedOnTrackChange();
        resetGreyBars();
      }
    }
  }

  if (!resolutions || resolutions.length === 0) return;
  const allResolutions = [...resolutions, { tag: "auto", supersript: "", height: "auto", width: "auto", framerate: "" }];
  const resolutionsEl = allResolutions.map((res) => {
    const fps = res.framerate > 30 ? Math.round(res.framerate) : "";
    const tagString = `${res.tag}${fps}`;
    let icon;
    if (tagString === resolution && preferredResolution) {
      icon = <TickIcon />;
    } else if (!preferredResolution && res.tag !== resolution && res.height === "auto") {
      icon = <TickIcon />;
    }
    return (
      <div className='resolution-item' onClick={() => changeResolution(`${res.height}`, res.tag, Math.round(res.framerate))} key={`${res.tag}`}>
        <p className='tick-container'>{icon}</p>
        <p>{tagString}</p>
        <p className='superscript'>{res.supersript}</p>
      </div>
    );
  });

  return (
    <div className='resolutions-settings menu-panel panel-item'>
      <div
        className='resolutions-upper settings-upper'
        onClick={() => dispatch(handleTranslating(null, "resolutions-settings", "settings-menu-selector-items"))}
      >
        <div className='settings-upper-left'>
          <ArrowLeftButton />
          <p>Quality</p>
        </div>
        <p className='custom-handler' onClick={() => dispatch(handleTranslating(1, "playback-speed-panel", "custom-speed"))}></p>
      </div>
      <div className='resolutions-settings-inner panel-selector-elements'>{resolutionsEl}</div>
    </div>
  );
};
