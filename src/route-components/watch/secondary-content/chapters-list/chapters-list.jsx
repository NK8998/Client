import { useDispatch, useSelector } from "react-redux";
import { usePlayerScrubbingBarInteractions } from "../../player/utilities/player-scrubbingBar-logic";
import { LoopIcon, LoopIconActive, ShareIcon, XIcon } from "../../../../assets/icons";
import { updateWatchState } from "../../../../store/Slices/watch-slice";
import { getTimeStamp } from "../../../../utilities/getTimestamp";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { updatePlayerState } from "../../../../store/Slices/player-slice";
import { toast } from "sonner";

export default function ChaptersList() {
  const windowWidth = useSelector((state) => state.app.windowWidth);
  const chapters = useSelector((state) => state.player.chapters);
  const chaptersListShowing = useSelector((state) => state.watch.chaptersListShowing);
  const { extraction_and_palette, video_id } = useSelector((state) => state.watch.playingVideo);
  const currentIndex = useSelector((state) => state.player.currentIndex);
  const syncChaptersToVideoTime = useSelector((state) => state.watch.syncChaptersToVideoTime);
  const location = useSelector((state) => state.app.location);
  const isDragging = useSelector((state) => state.player.isDragging);
  const { loopState, startTime, endTime } = useSelector((state) => state.player.loopChapterObj);
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
  }, [currentIndex, syncChaptersToVideoTime, chaptersListShowing, location, windowWidth]);

  useEffect(() => {
    if (chaptersListShowing) {
      removeChaptersList();
    }
    dispatch(updatePlayerState({ playerPropertyToUpdate: "loopChapterObj", updatedValue: { loopState: false, startTime: 0, endTime: 0 } }));
  }, [video_id]);

  useLayoutEffect(() => {
    const chaptersList = document.querySelector(".chapters-list");
    const secondary = document.querySelector(".secondary.content");
    const interactablePanel = document.querySelector(".interactable-panel");

    if (!interactablePanel || !secondary || !chaptersList) return;

    if (windowWidth <= 1040 && Array.from(secondary.children).includes(chaptersList)) {
      secondary.removeChild(chaptersList);
      interactablePanel.appendChild(chaptersList);
    } else if (windowWidth > 1040 && Array.from(interactablePanel.children).includes(chaptersList)) {
      interactablePanel.removeChild(chaptersList);
      secondary.appendChild(chaptersList);
    }
  }, [windowWidth, location]);

  useLayoutEffect(() => {
    const playerContainer = document.querySelector(".player-outer");
    const videoRef = document.querySelector(".html5-player");

    if (!playerContainer || !videoRef) return;

    const handleLooping = () => {
      if (videoRef.currentTime >= endTime - 0.7) {
        toast("Chapter repeat is on", {
          unstyled: true,
          className: "sonner-toast chapter-loop-on",
          action: {
            className: "chapter-loop-on-btn",
            label: "Turn off",
            onClick: () => {
              dispatch(updatePlayerState({ playerPropertyToUpdate: "loopChapterObj", updatedValue: { loopState: false, startTime: 0, endTime: 0 } }));
            },
          },
          duration: 3000,
        });
        playerContainer.classList.add("seeking");

        videoRef.currentTime = startTime;
        requestAnimationFrame(() => {
          playerContainer.classList.remove("seeking");
        });
      }
    };
    if (loopState) {
      videoRef.addEventListener("timeupdate", handleLooping);
    } else {
      videoRef.removeEventListener("timeupdate", handleLooping);
    }

    return () => {
      videoRef.removeEventListener("timeupdate", handleLooping);
    };
  }, [loopState]);

  useLayoutEffect(() => {
    const chapterPadding = document.querySelectorAll(".chapter-hover");

    if (loopState) {
      chapterPadding.forEach((chapter, index) => {
        if (index !== currentIndex) {
          chapter.classList.add("loop-on");
        } else {
          chapter.classList.add("current");
        }
      });
    } else {
      chapterPadding.forEach((chapter) => {
        chapter.classList.remove("loop-on");
        chapter.classList.remove("current");
      });
    }
  }, [loopState, currentIndex]);

  if (!extraction_and_palette || !chaptersListShowing) return <div className='chapters-list'></div>;

  const handleInteractableClick = (time) => {
    dispatch(updatePlayerState({ playerPropertyToUpdate: "loopChapterObj", updatedValue: { loopState: false, startTime: 0, endTime: 0 } }));
    const videoRef = document.querySelector(".html5-player");

    videoRef.currentTime = time;
  };

  const handleLoopIconClick = (chapter) => {
    const { start, end } = chapter;
    dispatch(
      updatePlayerState({ playerPropertyToUpdate: "loopChapterObj", updatedValue: { loopState: !loopState, startTime: start, endTime: end } })
    );
  };

  const interactableListElements = chapters.map((chapter, index) => {
    const width = 100;
    const height = 56;
    const dimensions = { width, height };
    const { offsetX, offsetY, backgroundPallete } = retrieveCurPalleteAndTile(chapter.start, null, dimensions);
    const { paletteSize } = extraction_and_palette;

    return (
      <div className={`chapter-interactable-row ${index === currentIndex ? "current" : ""}`} key={`chapterlist-inex-${index}`}>
        <div className='chapter-interactable-row-inner'>
          <div
            className='chapter-interactable-row-left'
            autoCapitalize='true'
            onClick={() => {
              handleInteractableClick(chapter.start);
            }}
          >
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
          {index === currentIndex && (
            <div className='chapter-interactable-row-right'>
              <div className='share-icon interactable-row-icon'>
                <ShareIcon />
              </div>
              <div
                className={`loop-icon interactable-row-icon ${loopState ? "active" : ""}`}
                onClick={() => {
                  handleLoopIconClick(chapter);
                }}
              >
                {loopState ? <LoopIconActive /> : <LoopIcon />}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  });

  const handleScroll = (e) => {
    if (scrollingRef.current) {
      clearTimeout(scrollingRef.current);
    }
    scrollingRef.current = setTimeout(() => {
      if (!syncButtonClicked && !isDragging) {
        dispatch(updateWatchState({ watchPropertyToUpdate: "syncChaptersToVideoTime", updatedValue: false }));
      }
      setSyncButtonClicked(false);
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
