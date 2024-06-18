import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePlayerScrubbingBarInteractions } from "./player-scrubbingBar-logic";
import { updatePlayerState } from "../../../../store/Slices/player-slice";
import { getTimeStamp } from "../../../../utilities/getTimestamp";
import { updateWatchState } from "../../../../store/Slices/watch-slice";

export const usePlayerDraggingLogic = () => {
  const mouseDownTracker = useRef();
  const isDragging = useRef(false);
  const chapters = useSelector((state) => state.player.chapters);
  const { previewCanvas, movePreviews } = usePlayerScrubbingBarInteractions();
  const [checkBufferedOnTrackChange, checkBuffered, clearIntervalOnTrackChange] = usePlayerBufferingState();
  const dispatch = useDispatch();
  const timeDelay = 180;
  const wasPlaying = useRef(false);

  const updateRedDot = (currentTimeTracker) => {
    const duration = chapters[chapters.length - 1].end;
    const redDotWrapperRef = document.querySelector(".red-dot-wrapper");
    const innerChapterContainerRef = document.querySelector(".chapters-container");
    const style = getComputedStyle(document.documentElement);
    const videoRef = document.querySelector("#html5-player");
    let currentTime = videoRef.currentTime;
    if (currentTimeTracker) {
      currentTime = currentTimeTracker;
    }

    if (currentTime >= 0 && currentTime <= duration) {
      const progressBarRefs = document.querySelectorAll(".progress.bar");
      const currentIndex = parseInt(style.getPropertyValue("--currentChapterIndex").trim());
      let progressBarRight = progressBarRefs[currentIndex]?.getBoundingClientRect().right;
      if (!progressBarRight) {
        progressBarRight = progressBarRefs[0]?.getBoundingClientRect().right;
      }
      const position = progressBarRight - innerChapterContainerRef.getBoundingClientRect().left;
      redDotWrapperRef.style.transform = `translateX(${position}px)`;
    } else if (currentTime < chapters[0].start) {
      const position = 0;
      redDotWrapperRef.style.transform = `translateX(${position}px)`;
    } else if (currentTime > chapters[chapters.length - 1].end) {
      const position = innerChapterContainerRef.clientWidth;
      redDotWrapperRef.style.transform = `translateX(${position}px)`;
    }
  };

  const handleClick = (e) => {
    const style = getComputedStyle(document.documentElement);
    const duration = chapters[chapters.length - 1].end;
    const chapterContainers = document.querySelectorAll(".chapter-hover");
    const currentIndex = parseInt(style.getPropertyValue("--hoverChapterIndex").trim());
    const chapterDuration = chapters[currentIndex].end - chapters[currentIndex].start;
    const { left, width } = chapterContainers[currentIndex].getBoundingClientRect();
    const position = e.clientX - left;
    const ratio = position / width;
    const timeOffset = ratio * chapterDuration;
    const currentTime = Math.min(Math.max(chapters[currentIndex].start + timeOffset, 0), duration - 0.1);
    if (isNaN(currentTime)) {
      return;
    }
    document.documentElement.style.setProperty("--dragTime", `${currentTime}`);
  };

  const handleDrag = (e) => {
    const timeContainer = document.querySelector(".time-left-container");
    const duration = chapters[chapters.length - 1].end;
    const chapterTitleContainers = document.querySelectorAll(".chapter-title-container");
    const redDotRef = document.querySelector(".red-dot");
    const redDotWrapperRef = document.querySelector(".red-dot-wrapper");
    const style = getComputedStyle(document.documentElement);
    const chapterContainers = document.querySelectorAll(".chapter-hover");
    const chapterPadding = document.querySelectorAll(".chapter-padding");
    const progressBarRefs = document.querySelectorAll(".progress.bar");
    const currentIndex = parseInt(style.getPropertyValue("--hoverChapterIndex").trim());
    const chapterDuration = chapters[currentIndex].end - chapters[currentIndex].start;
    const { left, width } = chapterContainers[currentIndex].getBoundingClientRect();
    const position = e.clientX - left;
    const ratio = position / width;
    const timeOffset = ratio * chapterDuration;
    const currentTime = Math.min(Math.max(chapters[currentIndex].start + timeOffset, 0), duration - 0.1);
    if (isNaN(currentTime)) {
      return;
    }
    const curTime = parseInt(style.getPropertyValue("--curTime").trim());
    const timeDiff = Date.now() - curTime > timeDelay;

    if (timeDiff) {
      previewCanvas(currentTime);
    }
    movePreviews(e, currentIndex);

    chapters.forEach((chapter, index) => {
      if (chapter.start <= currentTime && currentTime < chapter.end) {
        const chapterPaddingLeft = chapterPadding[index].getBoundingClientRect().left;
        const chapterPaddingWidth = chapterPadding[index].getBoundingClientRect().width;
        const position = e.clientX - chapterPaddingLeft;
        const newRatio = Math.max(Math.min(position / chapterPaddingWidth, 1), 0);
        progressBarRefs[index].style.transform = `scaleX(${newRatio})`;
        const curIndex = progressBarRefs[index].getAttribute("dataIndex");
        dispatch(updatePlayerState({ playerPropertyToUpdate: "currentIndex", updatedValue: parseInt(curIndex) }));
        document.documentElement.style.setProperty("--currentChapterIndex", `${curIndex}`);
        document.documentElement.style.setProperty("--hoverChapterIndex", `${curIndex}`);
        redDotRef.setAttribute("dataIndex", `${curIndex}`);
        redDotWrapperRef.setAttribute("dataIndex", `${curIndex}`);
        chapterPadding[index].classList.add("drag-expand");
        chapterTitleContainers.forEach((chapterTitleContainer) => {
          chapterTitleContainer.textContent = chapters[index].title;
        });
        timeContainer.textContent = getTimeStamp(Math.round(currentTime));
      } else if (chapter.end <= currentTime) {
        progressBarRefs[index].style.transform = `scaleX(${1})`;

        chapterPadding[index].classList.remove("drag-expand");
      } else {
        progressBarRefs[index].style.transform = `scaleX(${0})`;

        chapterPadding[index].classList.remove("drag-expand");
      }
    });

    updateRedDot(currentTime);
    redDotRef.style.scale = chapters.length === 1 ? 1 : 1.5;
    document.documentElement.style.setProperty("--dragTime", `${currentTime}`);
  };

  const handleTouchDrag = (e) => {
    handleDrag(e.touches[0]); // Use the first touch object
  };

  const removeEventListeners = () => {
    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", stopDragging);
    window.removeEventListener("touchmove", handleTouchDrag);
    window.removeEventListener("touchend", stopDragging);
  };

  const addEventListeners = (isTouching) => {
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", stopDragging);

    window.addEventListener("touchmove", handleTouchDrag);
    window.addEventListener("touchend", stopDragging);
  };

  const stopDragging = (e) => {
    const playerContainer = document.querySelector(".player-outer");
    const innerChapterContainerRef = document.querySelector(".chapters-container");
    const videoRef = document.querySelector("#html5-player");
    const scrubbingPreviewContainer = document.querySelector(".scrubbing-preview-container");
    const style = getComputedStyle(document.documentElement);
    const hovering = style.getPropertyValue("--hovering").trim();
    const dragTime = parseFloat(style.getPropertyValue("--dragTime").trim());
    const curTime = parseInt(style.getPropertyValue("--curTime").trim());
    const timeDiff = Date.now() - curTime <= timeDelay;

    document.documentElement.style.setProperty("--select", "");

    scrubbingPreviewContainer.classList.remove("show");

    if (mouseDownTracker.current && timeDiff) {
      clearTimeout(mouseDownTracker.current);
    }
    videoRef.currentTime = dragTime;

    if (hovering === "false" || e.touches) {
      document.querySelectorAll(".chapter-padding.drag-expand").forEach((el) => {
        el.classList.remove("drag-expand");
      });
      resetDot();
    }

    innerChapterContainerRef.classList.remove("drag-expand");
    removeEventListeners();
    dispatch(updatePlayerState({ playerPropertyToUpdate: "buffering", updatedValue: true }));
    dispatch(updatePlayerState({ playerPropertyToUpdate: "isDragging", updatedValue: false }));
    isDragging.current = false;
    checkBufferedOnTrackChange();
    playerContainer.classList.remove("seeking");

    if (wasPlaying.current === true) {
      videoRef.play();
    }
  };

  const startDrag = (e) => {
    if (e.button !== 0) return;
    dispatch(updateWatchState({ watchPropertyToUpdate: "syncChaptersToVideoTime", updatedValue: true }));

    removeEventListeners();
    const isTouching = e.touches ? e.touches.length > 0 : false;
    const innerChapterContainerRef = document.querySelector(".chapters-container");
    const videoRef = document.querySelector("#html5-player");
    const playerContainer = document.querySelector(".player-outer");

    document.documentElement.style.setProperty("--select", "none");
    document.documentElement.style.setProperty("--curTime", `${Date.now()}`);
    const style = getComputedStyle(document.documentElement);

    playerContainer.classList.add("seeking");

    isDragging.current = true;
    dispatch(updatePlayerState({ playerPropertyToUpdate: "isDragging", updatedValue: true }));
    clearIntervalOnTrackChange();
    wasPlaying.current = !videoRef.paused;
    videoRef.pause();

    addEventListeners(isTouching);

    if (isTouching) {
      handleDrag(e.touches[0]);
    } else {
      handleDrag(e);
    }
    const dragTime = parseFloat(style.getPropertyValue("--dragTime").trim());

    innerChapterContainerRef.classList.add("drag-expand");
    mouseDownTracker.current = setTimeout(() => {
      videoRef.style.visibility = "hidden";
      previewCanvas(dragTime);
    }, timeDelay);
  };

  const resetDot = () => {
    const redDotRef = document.querySelector(".red-dot");
    document.documentElement.style.setProperty("--hovering", `false`);
    redDotRef.style.scale = 0;
  };

  return { startDrag, stopDragging, handleClick, handleDrag, updateRedDot, resetDot, isDragging, removeEventListeners };
};

export const usePlayerBufferingState = () => {
  const timeIntervalRef = useRef();
  const dispatch = useDispatch();
  const isDragging = useSelector((state) => state.player.isDragging);

  const checkBufferedOnTrackChange = () => {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }
    timeIntervalRef.current = setInterval(() => {
      checkBuffered();
    }, 80);
  };

  const clearIntervalOnTrackChange = () => {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }
  };

  const checkBuffered = () => {
    const videoRef = document.querySelector("#html5-player");
    const spinnerRef = document.querySelector(".player-spinner");
    const previewImageBg = document.querySelector(".preview-image-bg");
    const previewImageBgContainer = document.querySelector(".preview-bg-relative");

    if (!videoRef) return;
    const currentTime = videoRef.currentTime;
    const buffered = videoRef.buffered;
    if (buffered.length > 0) {
      const bufferGroups = [];
      let currentGroup = [buffered.start(0), buffered.end(0)];

      for (let i = 0; i < buffered.length; i++) {
        const start = buffered.start(i);
        const end = buffered.end(i);

        if (start - currentGroup[1] <= 1) {
          currentGroup[1] = end;
        } else {
          bufferGroups.push(currentGroup);
          currentGroup = [start, end];
        }
      }
      bufferGroups.push(currentGroup);

      // Determine buffer range to use based on currentTime
      let bufferToUse;
      for (const group of bufferGroups) {
        if (currentTime >= group[0] && currentTime <= group[1]) {
          bufferToUse = group;
          break;
        }
      }
      if (!bufferToUse) {
        spinnerRef.classList.add("visible");
        return;
      }
      const end = bufferToUse[1];
      if (end > currentTime && end - currentTime >= 0) {
        if (!isDragging) {
          previewImageBg.classList.remove("show");
          previewImageBgContainer.classList.remove("darken");
          videoRef.style.visibility = "visible";
        }
        spinnerRef.classList.remove("visible");
        dispatch(updatePlayerState({ playerPropertyToUpdate: "buffering", updatedValue: false }));
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current);
        }
      } else if (currentTime > end || end - currentTime < 0) {
        spinnerRef.classList.add("visible");
      }
    } else {
      spinnerRef.classList.add("visible");
    }
  };

  return [checkBufferedOnTrackChange, checkBuffered, clearIntervalOnTrackChange];
};
