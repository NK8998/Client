export default function Chapters({
  chapters,
  chapterContainerRef,
  redDotRef,
  redDotWrapperRef,
  resetDot,
  startDrag,
  stopDragging,
  handleClick,
  updateScrubbingBar,
  innerChapterContainerRef,
}) {
  const chapterEls = chapters.map((chapter, index) => {
    // const calculatedPercentage = Math.round(((chapter.end - chapter.start) / chapters[chapters.length - 1].end) * 100);
    return (
      <div
        key={`${chapter.title + index}`}
        className={`chapter-padding ${chapters.length === 1 ? "single" : ""}`}
        dataindex={index}
        onClick={handleClick}
        style={{ marginRight: index === chapters.length - 1 ? "0px" : "2px" }}
        // style={{ width: index === 0 ? `${calculatedPercentage}%` : `calc(${calculatedPercentage}% - 2px)` }}
      >
        <div className='grey-bg bar' dataindex={index}></div>
        <div className='scrubbing bar' dataindex={index}></div>
        <div className='buffer bar' dataindex={index}></div>
        <div className='progress bar' dataindex={index}></div>
      </div>
    );
  });
  return (
    <div className='chapters-absolute' ref={chapterContainerRef}>
      <div
        className='chapters-container'
        ref={innerChapterContainerRef}
        onMouseMove={updateScrubbingBar}
        onMouseOut={resetDot}
        onMouseDown={startDrag}
        onMouseUp={stopDragging}
      >
        {chapterEls}
        <div ref={redDotWrapperRef} className='red-dot-wrapper'>
          <div className='red-dot' ref={redDotRef}></div>
        </div>
      </div>
    </div>
  );
}
