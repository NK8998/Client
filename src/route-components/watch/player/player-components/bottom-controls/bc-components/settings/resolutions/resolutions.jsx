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

  function changeResolution(resolution, tag) {
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
        dispatch(updateResolution(tag));
        checkBufferedOnTrackChange();
      }
    }
  }

  if (!resolutions || resolutions.length === 0) return;
  const allResolutions = [...resolutions, { tag: "auto", supersript: "", height: "auto", width: "auto" }];
  const resolutionsEl = allResolutions.map((res) => {
    let icon;
    if (res.tag === resolution && preferredResolution) {
      icon = <TickIcon />;
    } else if (!preferredResolution && res.tag !== resolution && res.height === "auto") {
      icon = <TickIcon />;
    }

    return (
      <div className='resolution-item' onClick={() => changeResolution(`${res.height}`, res.tag)} key={`${res.tag}`}>
        <p className='tick-container'>{icon}</p>
        <p>{res.tag}</p>
        <p className='superscript'>{res.supersript}</p>
      </div>
    );
  });

  return (
    <div className='resolutions-settings menu-panel'>
      <div className='resolutions-upper' onClick={() => dispatch(handleTranslating(null, "resolutions-settings", "settings-menu-selector-items"))}>
        <ArrowLeftButton />
        <p>Quality</p>
      </div>
      <div className='resolutions-settings-inner'>{resolutionsEl}</div>
    </div>
  );
};
