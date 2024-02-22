import { useDispatch } from "react-redux";
import MiniPlayer from "../../high-level-components/player/mini-player";
import Player from "../../high-level-components/player/player";
import "./watch.css";
import { useEffect } from "react";

export default function Watch({ watchRef }) {
  const dispatch = useDispatch();
  useEffect(() => {}, []);

  return (
    <div className='watch-flexy hidden' ref={watchRef} id='watch'>
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
