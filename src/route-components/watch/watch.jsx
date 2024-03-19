import { useDispatch, useSelector } from "react-redux";
import Player from "./player/player";
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
            <Link to={"/watch?v=QpZYoxRun3B"} onClick={() => dispatch(fetchWatchData("QpZYoxRun3B", "/watch"))}>
              first video
            </Link>
          </div>
          <div className='pseudo-link'>
            <Link to={"/watch?v=DfYP6AooQ8H"} onClick={() => dispatch(fetchWatchData("DfYP6AooQ8H", "/watch"))}>
              second video
            </Link>
          </div>
          <div className='pseud-link'>
            <Link to={"/watch?v=audxiH_CECi"} onClick={(e) => dispatch(fetchWatchData("audxiH_CECi", "/watch"))}>
              <div className='press me'>third video</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
