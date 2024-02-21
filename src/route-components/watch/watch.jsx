import { useDispatch } from "react-redux";
import MiniPlayer from "../../high-level-components/player/mini-player";
import Player from "../../high-level-components/player/player";
import "./watch.css";
import { updateLocation } from "../../store/Slices/app-slice";
import { useEffect } from "react";

export default function Watch({ watchRef }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const currentRoute = window.location.pathname.split("?")[0];
    dispatch(updateLocation(currentRoute));

    const isWatchPage = currentRoute.includes("watch");
    // if this is true proceed with data fetching and setting up components
  }, []);

  return (
    <div className='watch-flexy' ref={watchRef} id='watch'>
      <div className='player-expanded-container'></div>
      <div className='columns'>
        <div className='primary'>
          <Player />
          <MiniPlayer />
          <div className='lower'></div>
          <div className='secondary-in-primary'></div>
        </div>
        <div className='secondary-outer'></div>
      </div>
    </div>
  );
}
