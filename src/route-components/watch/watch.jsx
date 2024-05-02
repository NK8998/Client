import { useDispatch, useSelector } from "react-redux";
import Player from "./player/player";
import "./watch.css";
import { useLayoutEffect, useRef } from "react";
import SecondaryContent from "./secondary-content/secondary-content";
import Lower from "./lower/lower";

export default function Watch({ watchRef, miniPlayerBoolean }) {
  const videoRef = useRef();
  const primaryRef = useRef();
  const secondaryRefOuter = useRef();
  const secondaryRefInner = useRef();
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
          <Lower />
          <div className='secondary-in-primary' ref={secondaryRefInner}></div>
        </div>
        <div className='secondary content' ref={secondaryRefOuter}>
          <SecondaryContent secondaryRefInner={secondaryRefInner} secondaryRefOuter={secondaryRefOuter} />
        </div>
      </div>
    </div>
  );
}
