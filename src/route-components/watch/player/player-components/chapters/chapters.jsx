import { useDispatch, useSelector } from "react-redux";
import { usePlayerMouseMove } from "../../utilities/player-mouse-interactions";
import { seekVideo } from "../../utilities/player-progressBar-logic";
import { usePlayerScrubbingBarInteractions } from "../../utilities/player-scrubbingBar-logic";
import { usePlayerBufferingState, usePlayerDraggingLogic } from "../../utilities/player-dragging-logic";
import { updatePlayerState } from "../../../../../store/Slices/player-slice";

export default function Chapters({ videoRef, chapterContainerRef, redDotRef, redDotWrapperRef, innerChapterContainerRef }) {
  const settingsShowing = useSelector((state) => state.player.settingsShowing);
  const chapters = useSelector((state) => state.player.chapters);
  const { handleMouseMove } = usePlayerMouseMove();
  const { updateScrubbingBar } = usePlayerScrubbingBarInteractions();
  const { startDrag, resetDot, isDragging } = usePlayerDraggingLogic();
  const [checkBufferedOnTrackChange, checkBuffered] = usePlayerBufferingState();
  const dispatch = useDispatch();

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
    const videoRef = document.querySelector("#html5-player");
    const currentTime = videoRef.currentTime;

    if (key === "arrowdown") {
      e.preventDefault();
      dispatch(updatePlayerState({ playerPropertyToUpdate: "seeking", updatedValue: true }));
      seekVideo(currentTime - timeStep);
      checkBuffered();
    } else if (key === "arrowup") {
      e.preventDefault();
      dispatch(updatePlayerState({ playerPropertyToUpdate: "seeking", updatedValue: true }));
      seekVideo(currentTime + timeStep);
      checkBuffered();
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
        onTouchMove={(e) => {
          updateScrubbingBar(e.touches[0]);
        }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onKeyDown={handleKeyDown}
        onMouseOver={handleMouseEnter}
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
