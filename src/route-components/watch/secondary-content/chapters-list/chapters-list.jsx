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
  const [interactableClicked, setInteractableClicked] = useState(false);
  const [scrollPosCalculated, setScrollPosCalculated] = useState(false);
  const scrollingRef = useRef(false);
  const previousIndex = useRef(0);

  const removeChaptersList = () => {
    setScrollPosCalculated(false);
    setInteractableClicked(false);
    setSyncButtonClicked(false);
    dispatch(updateWatchState({ watchPropertyToUpdate: "chaptersListShowing", updatedValue: false }));
  };

  const getScrollDeviation = () => {
    /**
     * Calculates the scroll position needed for chapter interactables based on their heights.
     * Adjusts the scroll position and updates the `scrollPosCalculated` boolean accordingly.
     *
     * @returns {void}
     */
    if (!chapterListRef.current || !syncChaptersToVideoTime) return;

    let scrollDeviation = 0;

    const interactablesElements = Array.from(document.querySelectorAll(".chapter-interactable-row")).slice(0, currentIndex);

    interactablesElements.forEach((el) => {
      const { height } = el.getBoundingClientRect();
      scrollDeviation += height;
    });

    (Math.abs(previousIndex.current - currentIndex) > 0 || scrollDeviation > 0) && setScrollPosCalculated(true);

    chapterListRef.current.scrollTo({ top: scrollDeviation, behavior: "smooth" });
    previousIndex.current = currentIndex;
  };

  useLayoutEffect(getScrollDeviation, [currentIndex, syncChaptersToVideoTime, chaptersListShowing, location, windowWidth]);

  useLayoutEffect(() => {
    // Doing this so scroll position is calculated after the node has been appended into its respective div
    requestAnimationFrame(getScrollDeviation);
  }, [windowWidth]);

  useEffect(() => {
    // Close the chapter list when a user chooses a different video to save bandwidth
    if (chaptersListShowing) {
      removeChaptersList();
    }

    // Reset the loop state when a user selects a different video
    dispatch(
      updatePlayerState({
        playerPropertyToUpdate: "loopChapterObj",
        updatedValue: { loopState: false, startTime: 0, endTime: 0 },
      })
    );
  }, [video_id]);

  useLayoutEffect(() => {
    /**
     * Manages the positioning of the "chaptersList" div based on the window width.
     * This function ensures that unnecessary rerenders are avoided, which can lead to odd behavior.
     *
     * @param {number} windowWidth - The current window width.
     * @param {string} location - The current location.
     */
    const chaptersList = document.querySelector(".chapters-list-padding-box");
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
    /**
     * Sets up a time update event listener on the video element to handle chapter looping.
     * Removes the event listener when the `loopState` boolean is `false`.
     * Displays a toast notification each time the chapter loops.
     *
     * @returns {() => void} A cleanup function to remove the event listener.
     */

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

        // Add the "seeking" class to ensure smooth progress bar positioning
        playerContainer.classList.add("seeking");
        videoRef.currentTime = startTime;

        // Remove the "seeking" class after a delay for smooth transition
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
    /*
     * Loops over all chapter containers and sets the "loop-on" class or removes it
     * depending on the value of the "loopState" boolean.
     * Additionally, the "current" class is added to the chapter container where the loop is currently happening.
     */
    const chapterContainers = document.querySelectorAll(".chapter-hover");

    if (loopState) {
      chapterContainers.forEach((chapter, index) => {
        if (index !== currentIndex) {
          chapter.classList.add("loop-on");
        } else {
          chapter.classList.add("current");
        }
      });
    } else {
      chapterContainers.forEach((chapter) => {
        chapter.classList.remove("loop-on");
        chapter.classList.remove("current");
      });
    }
  }, [loopState, currentIndex]);

  // Doing this so that teh chapters-list div is always availabe
  if (!extraction_and_palette || !chaptersListShowing)
    return (
      <div className='chapters-list-padding-box'>
        <div className='chapters-list'></div>
      </div>
    );

  const handleInteractableClick = (time) => {
    /**
     * Handles the click event on an interactable element (chapter).
     * - Sets `interactableClicked` to `true`.
     * - Disables chapter looping by setting `loopState` to `false`.
     * - Sets the current time of the video to the specified `time`.
     *
     * @param {number} time - The desired video time in seconds.
     * @returns {void}
     */

    setInteractableClicked(true);
    dispatch(
      updatePlayerState({
        playerPropertyToUpdate: "loopChapterObj",
        updatedValue: { loopState: false, startTime: 0, endTime: 0 },
      })
    );
    const videoRef = document.querySelector(".html5-player");
    videoRef.currentTime = time;
  };

  const handleLoopIconClick = (chapter) => {
    /**
     * Toggles the chapter loop state and updates the loop start and end times.
     *
     * @param {Object} chapter - The chapter object containing `start` and `end` properties.
     * @returns {void}
     */

    const { start, end } = chapter;
    dispatch(
      updatePlayerState({
        playerPropertyToUpdate: "loopChapterObj",
        updatedValue: { loopState: !loopState, startTime: start, endTime: end },
      })
    );
  };

  const interactableListElements = chapters.map((chapter, index) => {
    /**
     * Generates a list of interactable chapter elements based on the provided chapters data.
     *
     * @param {Array} chapters - An array of chapter objects.
     * @param {number} currentIndex - The index of the currently active chapter.
     * @param {boolean} loopState - Indicates whether chapter looping is enabled.
     * @returns {Array} An array of React elements representing the interactable chapters.
     */

    const width = 100;
    const height = 56;
    const dimensions = { width, height };
    const { offsetX, offsetY, backgroundPallete } = retrieveCurPalleteAndTile(chapter.start, null, dimensions);
    const { paletteSize } = extraction_and_palette;

    return (
      <div className={`chapter-interactable-row ${index === currentIndex ? "current" : ""}`} key={`chapterlist-index-${index}`}>
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
    /**
     * Debounces the scroll event to prevent premature boolean resets.
     * Updates the `syncChaptersToVideoTime` property based on various conditions.
     *
     * @param {Event} e - The scroll event object. Currently not utilized. Might come in handy in case a bug arises.
     * @returns {void}
     */
    if (scrollingRef.current) {
      clearTimeout(scrollingRef.current);
    }
    scrollingRef.current = setTimeout(() => {
      if (!syncButtonClicked && !isDragging && !interactableClicked && !scrollPosCalculated) {
        dispatch(updateWatchState({ watchPropertyToUpdate: "syncChaptersToVideoTime", updatedValue: false }));
      }
      setSyncButtonClicked(false);
      setInteractableClicked(false);
      setScrollPosCalculated(false);
    }, 200);
  };

  return (
    <div className={`chapters-list-padding-box ${chaptersListShowing && chapters.length > 1 ? "show" : ""}`}>
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
    </div>
  );
}
