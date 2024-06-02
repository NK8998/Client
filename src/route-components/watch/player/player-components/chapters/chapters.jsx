import { useDispatch, useSelector } from "react-redux";
import { usePlayerMouseMove } from "../../utilities/player-mouse-interactions";
import { seekVideo, usePlayerProgressBarLogic } from "../../utilities/player-progressBar-logic";
import { usePlayerScrubbingBarInteractions } from "../../utilities/player-scrubbingBar-logic";
import { usePlayerDraggingLogic } from "../../utilities/player-dragging-logic";
import { updateSeeking } from "../../../../../store/Slices/player-slice";
import { useRef } from "react";

export default function Chapters({ videoRef, chapterContainerRef, redDotRef, redDotWrapperRef, innerChapterContainerRef }) {
  const settingsShowing = useSelector((state) => state.player.settingsShowing);
  const chapters = useSelector((state) => state.player.chapters);
  const [handleMouseMove, handleHover, handleMouseOut] = usePlayerMouseMove();
  const [updateBufferBar, updateProgressBar] = usePlayerProgressBarLogic();
  const [updateScrubbingBar, previewCanvas, movePreviews] = usePlayerScrubbingBarInteractions();
  const [startDrag, stopDragging, handleClick, handleDrag, updateRedDot, resetDot, isDragging] = usePlayerDraggingLogic();
  const dispatch = useDispatch();
  const newTime = useRef(0);
  const timeoutRef3 = useRef();

  const chapterEls = chapters.map((chapter, index) => {
    return (
      <div className={`chapter-hover ${chapters.length === 1 ? "single" : ""}`} dataindex={index} key={`hover-${chapter.title + index}`}>
        <div key={`${chapter.title + index}`} className={`chapter-padding ${chapters.length === 1 ? "single" : ""}`} dataindex={index}>
          <div className='grey-bg bar' dataindex={index}></div>
          <div className='scrubbing bar' dataindex={index} style={{ transform: "scaleX(0)" }}></div>
          <div className='buffer bar' dataindex={index} style={{ transform: "scaleX(0)" }}></div>
          <div className='progress bar' dataindex={index} style={{ transform: "scaleX(0)" }}></div>
        </div>
      </div>
    );
  });

  const handleKeyDown = (e) => {
    const key = e.key.toLowerCase();
    const timeStep = 5;
    if (key === "arrowdown") {
      e.preventDefault();
      if (timeoutRef3.current) {
        clearTimeout(timeoutRef3.current);
      }
      newTime.current = newTime.current - timeStep;
    } else if (key === "arrowup") {
      e.preventDefault();
      if (timeoutRef3.current) {
        clearTimeout(timeoutRef3.current);
      }
      newTime.current = newTime.current + timeStep;
    }
  };
  const handleKeyUp = (e) => {
    const key = e.key.toLowerCase();
    const videoRef = document.querySelector("#html5-player");
    const currentTime = videoRef.currentTime;

    if (key === "arrowdown" || key === "arrowup") {
      e.preventDefault();

      timeoutRef3.current = setTimeout(() => {
        dispatch(updateSeeking(true));
        seekVideo(newTime.current + currentTime, videoRef);
        newTime.current = 0;
      }, 170);
    }
  };
  const handleMouseEnter = () => {
    if (settingsShowing) return;
    const scrubbingPreviewContainer = document.querySelector(".scrubbing-preview-container");
    scrubbingPreviewContainer.classList.add("show");
  };
  const handleMouseLeave = () => {
    document.documentElement.style.setProperty("--hovering", `false`);

    if (isDragging.current === true) return;
    resetDot();
    const chaptersContainers = document.querySelectorAll(".chapter-padding");
    chaptersContainers.forEach((chaptersContainer, index) => {
      chaptersContainer.classList.remove("drag-expand");
    });
    const scrubbingPreviewContainer = document.querySelector(".scrubbing-preview-container");
    scrubbingPreviewContainer.classList.remove("show");
  };
  return (
    <div className='chapters-absolute' ref={chapterContainerRef}>
      <div
        className={`chapters-container ${chapters.length === 1 ? "single" : ""}`}
        ref={innerChapterContainerRef}
        tabIndex={0}
        onFocus={handleMouseMove}
        onMouseMove={updateScrubbingBar}
        onMouseOverCapture={updateScrubbingBar}
        onTouchMove={(e) => {
          updateScrubbingBar(e.touches[0]);
        }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseOver={handleMouseEnter}
        onMouseMoveCapture={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {chapterEls}
        <div ref={redDotWrapperRef} className='red-dot-wrapper' dataindex={0}>
          <div className='red-dot' ref={redDotRef} dataindex={0}></div>
        </div>
      </div>
    </div>
  );
}
