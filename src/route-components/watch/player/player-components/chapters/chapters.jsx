import { useSelector } from "react-redux";
import { usePlayerMouseMove } from "../../utilities/player-mouse-interactions";
import { seekVideo } from "../../utilities/player-progressBar-logic";

export default function Chapters({
  videoRef,
  updateProgressBar,
  updateRedDot,
  chapterContainerRef,
  redDotRef,
  redDotWrapperRef,
  resetDot,
  startDrag,
  stopDragging,
  handleClick,
  updateScrubbingBar,
  innerChapterContainerRef,
  chapters,
  isDragging,
}) {
  const settingsShowing = useSelector((state) => state.player.settingsShowing);
  const [handleMouseMove] = usePlayerMouseMove();
  const chapterEls = chapters.map((chapter, index) => {
    // const calculatedPercentage = Math.round(((chapter.end - chapter.start) / chapters[chapters.length - 1].end) * 100);
    return (
      <div
        className={`chapter-hover ${chapters.length === 1 ? "single" : ""}`}
        dataindex={index}
        key={`hover-${chapter.title + index}`}
        style={{ marginRight: index === chapters.length - 1 ? "0px" : "2px" }}
      >
        <div
          key={`${chapter.title + index}`}
          className={`chapter-padding ${chapters.length === 1 ? "single" : ""}`}
          dataindex={index}
          onClick={handleClick}
          // style={{ width: index === 0 ? `${calculatedPercentage}%` : `calc(${calculatedPercentage}% - 2px)` }}
        >
          <div className='grey-bg bar' dataindex={index}></div>
          <div className='scrubbing bar' dataindex={index}></div>
          <div className='buffer bar' dataindex={index}></div>
          <div className='progress bar' dataindex={index}></div>
        </div>
      </div>
    );
  });
  const handleKeyDown = (e) => {
    const key = e.key.toLowerCase();
    const currentTime = videoRef.current.currentTime;
    const timeStep = 5;
    let newTime;

    if (key === "arrowdown") {
      e.preventDefault();

      newTime = currentTime - timeStep;
      seekVideo(newTime, videoRef);
    } else if (key === "arrowup") {
      e.preventDefault();

      newTime = currentTime + timeStep;
      seekVideo(newTime, videoRef);
    }
    updateProgressBar(chapters);
    updateRedDot(newTime);
  };
  const handleFocus = (e) => {
    handleMouseMove();
  };
  const handleMouseEnter = () => {
    if (settingsShowing) return;
    const scrubbingPreviewContainer = document.querySelector(".scrubbing-preview-container");
    scrubbingPreviewContainer.classList.add("show");
  };
  const handleMouseLeave = () => {
    if (isDragging.current === true) return;
    const scrubbingPreviewContainer = document.querySelector(".scrubbing-preview-container");
    scrubbingPreviewContainer.classList.remove("show");
  };
  return (
    <div className='chapters-absolute' ref={chapterContainerRef}>
      <div
        className={`chapters-container ${chapters.length === 1 ? "single" : ""}`}
        ref={innerChapterContainerRef}
        tabIndex={0}
        onFocus={handleFocus}
        onMouseMove={updateScrubbingBar}
        onMouseOut={resetDot}
        onMouseDown={startDrag}
        onMouseUp={stopDragging}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {chapterEls}
        <div ref={redDotWrapperRef} className='red-dot-wrapper'>
          <div className='red-dot' ref={redDotRef}></div>
        </div>
      </div>
    </div>
  );
}
