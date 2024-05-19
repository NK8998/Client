import DOMPurify from "dompurify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { convertToSeconds } from "../../player/player-components/chapters/chaptersGen";
import { usePlayerProgressBarLogic } from "../../player/utilities/player-progressBar-logic";
import { usePlayerBufferingState, usePlayerDraggingLogic } from "../../player/utilities/player-dragging-logic";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatCount, generateRandomInteger } from "../../../../utilities/fomatCount";
import UploderDetails from "../lower-interactions/uploader-details";
import { DateFormatter } from "../../../../utilities/date-formatter";
import UserRoleInfo from "./user-role-info";
import { debounce } from "lodash";

export default function Description() {
  const { description_string, video_id, created_at } = useSelector((state) => state.watch.playingVideo);
  const location = useSelector((state) => state.app.location);
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const windowWidth = useSelector((state) => state.app.windowWidth);
  const [updateBufferBar, updateProgressBar] = usePlayerProgressBarLogic();
  const [startDrag, stopDragging, handleClick, handleDrag, updateRedDot, resetDot, isDragging] = usePlayerDraggingLogic();
  const [checkBufferedOnTrackChange, checkBuffered, clearIntervalOnTrackChange] = usePlayerBufferingState();
  const [showMore, setShowMore] = useState(false);
  const showMoreButton = useRef();

  const handleChapterClick = (e, time) => {
    e.preventDefault();
    const videoRef = document.querySelector("#html5-player");
    if (!videoRef || !time) return;

    videoRef.currentTime = time;
    updateProgressBar();
    updateRedDot();
    checkBufferedOnTrackChange();
  };
  const recalculatePosition = () => {
    requestAnimationFrame(() => {
      const lines = document.querySelectorAll(".formatted-string-span");
      if (lines === null || lines === undefined) return;

      lines.forEach((line) => {
        line.classList.remove("fold");
        line.classList.remove("hidden");
      });

      let lastWidth = 0;
      let cumulativeHeight = 0;
      let foldIndex = null;

      lines.forEach((line, index) => {
        const lineHeight = Math.max(line.getBoundingClientRect().height, 17);
        cumulativeHeight = cumulativeHeight + lineHeight;

        if (index === 0) {
          line.classList.add("first");
        }
        if (cumulativeHeight >= 54 && foldIndex === null) {
          foldIndex = index;
          line.classList.add("fold");
          lastWidth = line.getBoundingClientRect().width;
        } else if (foldIndex !== null && index > foldIndex) {
          if (!showMore) {
            line.classList.remove("fold");
            line.classList.add("hidden");
          } else if (showMore) {
            line.classList.remove("hidden");
          }
        }
      });

      if (showMore) {
        lines.forEach((line) => {
          line.classList.remove("fold");
          line.classList.remove("hidden");
        });
      }

      const width = Math.max(lastWidth - showMoreButton.current.clientWidth, 5);

      showMoreButton.current.style.left = `${showMore ? 0 : width}px`;
    });
  };

  const processString = (string) => {
    const cleanString = DOMPurify.sanitize(string);
    let lines = cleanString.split("\n");

    let processedLines = lines.map((line, index) => {
      let parts = line.split(/(\b\d{1,2}:\d{2}\b)|(https?:\/\/[^\s]+)/g);

      let processedParts = parts.map((part, index) => {
        if (/\b\d{1,2}:\d{2}\b/.test(part)) {
          const timeInSeconds = convertToSeconds(part);
          return (
            <Link
              key={`${index}-${video_id}-formatted-part-span`}
              to={`/watch?v=${video_id}&t=${timeInSeconds}`}
              className='time-marker-link'
              onClick={(e) => handleChapterClick(e, timeInSeconds)}
            >
              {part}
            </Link>
          );
        } else if (/https?:\/\/[^\s]+/.test(part)) {
          return (
            <a key={`${index}-formatted-hyper-links`} href={part} target='_blank' rel='noopener noreferrer' className='formatted-hyper-links'>
              {part}
            </a>
          );
        }

        return part;
      });

      return (
        <span key={`${index}-string-span-${video_id}`} className={`formatted-string-span`}>
          {processedParts}
        </span>
      );
    });

    return processedLines;
  };

  const processedLines = processString(description_string || "");

  useEffect(() => {
    recalculatePosition();
    const debouncedVer = debounce(recalculatePosition, 200);
    window.addEventListener("resize", debouncedVer);
    return () => {
      window.removeEventListener("resize", debouncedVer);
    };
  }, [location, fullScreen, processedLines, showMore, windowWidth]);

  const handleFormattedStringClick = () => {
    if (showMore) return;
    setShowMore(true);
  };
  const views = useMemo(() => {
    return generateRandomInteger();
  }, [video_id]);

  return (
    <div
      className={`description ${showMore ? "expanded" : "folded"}`}
      style={{ cursor: showMore ? "unset" : "pointer" }}
      onClick={handleFormattedStringClick}
    >
      <div className='description-upper'>
        <p>{showMore ? views : formatCount(views)} views </p>
        <p> {DateFormatter(created_at)}</p>
      </div>
      <div className='description-lower'>
        <p className='formatted-string' style={{ pointerEvents: showMore ? "all" : "none" }}>
          {processedLines}
        </p>
        {showMore && (
          <div className='description-lower-uploader-details'>
            <UploderDetails />
            <UserRoleInfo />
          </div>
        )}
        <span
          ref={showMoreButton}
          className={`show-formatted-string ${!showMore ? "box-shadow" : ""}`}
          onClick={() => setShowMore(false)}
          style={{ pointerEvents: showMore ? "all" : "none" }}
        >
          {!showMore ? "...more" : "Show less"}
        </span>
      </div>
    </div>
  );
}
