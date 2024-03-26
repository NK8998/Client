import { useDispatch, useSelector } from "react-redux";
import Player from "./player/player";
import "./watch.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchWatchData } from "../../store/Slices/watch-slice";

export default function Watch({ watchRef, miniPlayerBoolean }) {
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
            <Player videoRef={videoRef} containerRef={containerRef} miniPlayerBoolean={miniPlayerBoolean} />
          </div>
          <div className='lower'></div>
          <div className='secondary-in-primary'></div>
        </div>
        <div className='secondary content' ref={secondaryRef}>
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
          <div className='pseud-link'>
            <Link to={"/watch?v=XnY3LmSZpFy"} onClick={(e) => dispatch(fetchWatchData("XnY3LmSZpFy", "/watch"))}>
              <div className='press me'>fourth video</div>
            </Link>
          </div>
          <div className='pseud-link'>
            <Link to={"/watch?v=QJI_jNDhZOe"} onClick={(e) => dispatch(fetchWatchData("QJI_jNDhZOe", "/watch"))}>
              <div className='press me'>fifth video</div>
            </Link>
          </div>
          <div className='pseud-link'>
            <Link to={"/watch?v=xxfoYqTS86d"} onClick={(e) => dispatch(fetchWatchData("xxfoYqTS86d", "/watch"))}>
              <div className='press me'>RX 580</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
