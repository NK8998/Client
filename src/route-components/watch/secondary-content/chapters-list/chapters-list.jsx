import { useDispatch, useSelector } from "react-redux";
import { usePlayerScrubbingBarInteractions } from "../../player/utilities/player-scrubbingBar-logic";
import { XIcon } from "../../../../assets/icons";
import { updateWatchState } from "../../../../store/Slices/watch-slice";
import { getTimeStamp } from "../../../../utilities/getTimestamp";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function ChaptersList() {
  const chapters = useSelector((state) => state.player.chapters);
  const chaptersListShowing = useSelector((state) => state.watch.chaptersListShowing);
  const { extraction_and_palette, video_id } = useSelector((state) => state.watch.playingVideo);
  const currentIndex = useSelector((state) => state.player.currentIndex);
  const syncChaptersToVideoTime = useSelector((state) => state.watch.syncChaptersToVideoTime);
  const location = useSelector((state) => state.app.location);
  const isDragging = useSelector((state) => state.player.isDragging);
  const { retrieveCurPalleteAndTile } = usePlayerScrubbingBarInteractions();
  const dispatch = useDispatch();
  const chapterListRef = useRef(null);
  const [syncButtonClicked, setSyncButtonClicked] = useState(false);
  const scrollingRef = useRef(false);

  const removeChaptersList = () => {
    dispatch(updateWatchState({ watchPropertyToUpdate: "chaptersListShowing", updatedValue: false }));
  };

  useLayoutEffect(() => {
    if (!chapterListRef.current || !syncChaptersToVideoTime) return;
    setSyncButtonClicked(true);
    let scrollDeviation = 0;

    const interactablesElements = Array.from(document.querySelectorAll(".chapter-interactable-row")).slice(0, currentIndex);

    interactablesElements.forEach((el) => {
      const { height } = el.getBoundingClientRect();
      scrollDeviation += height;
    });

    chapterListRef.current.scrollTo({ top: scrollDeviation, behavior: "smooth" });
  }, [currentIndex, syncChaptersToVideoTime, chaptersListShowing, location]);

  useEffect(() => {
    if (chaptersListShowing) {
      removeChaptersList();
    }
  }, [video_id]);

  if (!extraction_and_palette || !chaptersListShowing) return <></>;

  const handleInteractableClick = (time) => {
    const videoRef = document.querySelector(".html5-player");

    videoRef.currentTime = time;
  };

  const interactableListElements = chapters.map((chapter, index) => {
    const width = 100;
    const height = 56;
    const dimensions = { width, height };
    const { offsetX, offsetY, backgroundPallete } = retrieveCurPalleteAndTile(chapter.start, null, dimensions);
    const { paletteSize } = extraction_and_palette;

    return (
      <div className={`chapter-interactable-row ${index === currentIndex ? "current" : ""}`} key={`chapterlist-inex-${index}`}>
        <div
          className='chapter-interactable-row-inner'
          onClick={() => {
            handleInteractableClick(chapter.start);
          }}
        >
          <div className='chapter-interactable-row-left'>
            <div
              className='interactable-chapter-image'
              style={{
                backgroundImage: `url(${backgroundPallete})`,
                backgroundSize: `${width * paletteSize}px ${height * paletteSize}px`,
                backgroundPosition: `-${offsetX}px -${offsetY}px`,
              }}
            />
            <div className='interactable-info'>
              <p className='interactable-title'>{chapter.title}</p>
              <p className='interactable-timestamp'>{getTimeStamp(chapter.start)}</p>
            </div>
          </div>
          <div className='chapter-interactable-row-right'></div>
        </div>
      </div>
    );
  });

  const handleScroll = (e) => {
    if (scrollingRef.current) {
      clearTimeout(scrollingRef.current);
    }
    scrollingRef.current = setTimeout(() => {
      setSyncButtonClicked(false);

      if (!syncButtonClicked && !isDragging) {
        dispatch(updateWatchState({ watchPropertyToUpdate: "syncChaptersToVideoTime", updatedValue: false }));
      }
    }, 200);
  };
  return (
    <div className={`chapters-list ${chaptersListShowing && chapters.length > 1 ? "show" : ""}`}>
      <div className='chapters-header'>
        <p>Chapters</p>
        <div className='x-svg' onClick={removeChaptersList}>
          <XIcon />
        </div>
      </div>
      <div className='chapters-list-interactable' ref={chapterListRef} onScroll={handleScroll}>
        {interactableListElements}
        <div className={`sync-interactables ${!syncChaptersToVideoTime ? "show" : "hide"}`}>
          <p
            onClick={() => {
              setSyncButtonClicked(true);
              dispatch(updateWatchState({ watchPropertyToUpdate: "syncChaptersToVideoTime", updatedValue: true }));
            }}
          >
            Sync to video time
          </p>
        </div>
      </div>
    </div>
  );
}
