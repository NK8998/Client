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

export default function Description() {
  const { description_string, video_id, created_at } = useSelector((state) => state.watch.playingVideo);
  const location = useSelector((state) => state.app.location);
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const [updateBufferBar, updateProgressBar] = usePlayerProgressBarLogic();
  const [startDrag, stopDragging, handleClick, handleDrag, updateRedDot, resetDot, isDragging] = usePlayerDraggingLogic();
  const [checkBufferedOnTrackChange, checkBuffered, clearIntervalOnTrackChange] = usePlayerBufferingState();
  const [showMore, setShowMore] = useState(false);
  const lastFoldedLine = useRef();
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

  useEffect(() => {
    if (showMore) {
      showMoreButton.current.style.left = `${0}px`;
      return;
    }
    if (lastFoldedLine.current && showMoreButton.current) {
      const width = Math.max(lastFoldedLine.current.clientWidth - showMoreButton.current.clientWidth, 5);
      showMoreButton.current.style.left = `${width}px`;
    }
  }, [location, video_id, showMore, fullScreen]);

  useEffect(() => {
    const recalculatePosition = () => {
      if (showMore) return;
      const width = Math.max(lastFoldedLine.current.clientWidth - showMoreButton.current.clientWidth, 5);

      requestAnimationFrame(() => {
        showMoreButton.current.style.left = `${width}px`;
      });
    };

    window.addEventListener("resize", recalculatePosition);

    return () => {
      window.removeEventListener("resize", recalculatePosition);
    };
  }, [location, showMore, fullScreen]);

  const processString = (string) => {
    const cleanString = DOMPurify.sanitize(string);
    // Split the string into lines
    let lines = cleanString.split("\n");

    // Process each line
    let processedLines = lines.map((line, index) => {
      // Split the line into parts by the time format
      let parts = line.split(/(\b\d{1,2}:\d{2}\b)/g);

      // Process each part
      let processedParts = parts.map((part, index) => {
        // If the part is a time format, wrap it in a Link component
        if (/\b\d{1,2}:\d{2}\b/.test(part)) {
          const timeInSeconds = convertToSeconds(part);
          return (
            <Link
              key={index}
              to={`/watch?v=${video_id}&t=${timeInSeconds}`}
              className='time-marker-link'
              onClick={(e) => handleChapterClick(e, timeInSeconds)}
            >
              {part}
            </Link>
          );
        }

        // Otherwise, return the part as is
        return part;
      });

      // Join the processed parts back into a line, and wrap the line in a <p> tag
      return (
        <span
          key={index}
          style={{ display: index > 0 && !showMore ? "none" : "" }}
          className={`formatted-string-span ${index === 0 && !showMore ? "fold" : ""}`}
          ref={index === 0 ? lastFoldedLine : null}
        >
          {processedParts}
        </span>
      );
    });

    return processedLines;
  };

  const processedLines = processString(description_string || "");

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
