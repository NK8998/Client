import { useDispatch, useSelector } from "react-redux";
import Player from "../../high-level-components/player/player";
import "./watch.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchWatchData } from "../../store/Slices/watch-slice";

export default function Watch({ watchRef, miniplayerRef, miniPlayerBoolean }) {
  const dispatch = useDispatch();
  const videoRef = useRef();
  const primaryRef = useRef();
  const secondaryRef = useRef();
  const expandedContainerRef = useRef();
  const containerRef = useRef();

  return (
    <div className='watch-flexy hidden' ref={watchRef} id='watch'>
      <div className='player-expanded-container' ref={expandedContainerRef}></div>
      <div className='columns'>
        <div className='primary'>
          <div className='player-if' ref={primaryRef}>
            <Player
              videoRef={videoRef}
              secondaryRef={secondaryRef}
              containerRef={containerRef}
              expandedContainerRef={expandedContainerRef}
              primaryRef={primaryRef}
              miniplayerRef={miniplayerRef}
              miniPlayerBoolean={miniPlayerBoolean}
            />
          </div>
          <div className='lower'></div>
          <div className='secondary-in-primary'></div>
        </div>
        <div className='secondary' ref={secondaryRef}>
          <div className='pseudo-link'>
            <Link to={"/watch?v=i94bjbYU"} onClick={() => dispatch(fetchWatchData("i94bjbYU", "/watch"))}>
              Next video
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
