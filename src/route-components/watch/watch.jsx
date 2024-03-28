import { useDispatch, useSelector } from "react-redux";
import Player from "./player/player";
import "./watch.css";
import { useLayoutEffect, useRef } from "react";
import SecondaryContent from "./secondary-content/secondary-content";

export default function Watch({ watchRef, miniPlayerBoolean }) {
  const videoRef = useRef();
  const primaryRef = useRef();
  const secondaryRefOuter = useRef();
  const secondaryRefInner = useRef();
  const expandedContainerRef = useRef();
  const containerRef = useRef();
  const windowWidth = useSelector((state) => state.app.windowWidth);

  useLayoutEffect(() => {
    const secondaryInnerContent = document.querySelector(".secondary-inner");
    if (!secondaryInnerContent || !secondaryRefInner.current || !secondaryRefOuter.current) return;
    if (windowWidth <= 1040) {
      if (!Array.from(secondaryRefOuter.current.children).includes(secondaryInnerContent)) return;

      secondaryRefOuter.current.removeChild(secondaryInnerContent);
      secondaryRefInner.current.appendChild(secondaryInnerContent);
    } else {
      if (!Array.from(secondaryRefInner.current.children).includes(secondaryInnerContent)) return;
      secondaryRefInner.current.removeChild(secondaryInnerContent);
      secondaryRefOuter.current.appendChild(secondaryInnerContent);
    }
  }, [windowWidth]);

  return (
    <div className='watch-flexy hidden' ref={watchRef} id='watch'>
      <div className='player-expanded-container' ref={expandedContainerRef}></div>
      <div className='columns'>
        <div className='primary'>
          <div className='player-if' ref={primaryRef}>
            <Player videoRef={videoRef} containerRef={containerRef} miniPlayerBoolean={miniPlayerBoolean} />
          </div>
          <div className='lower'></div>
          <div className='secondary-in-primary' ref={secondaryRefInner}></div>
        </div>
        <div className='secondary content' ref={secondaryRefOuter}>
          <SecondaryContent />
        </div>
      </div>
    </div>
  );
}
