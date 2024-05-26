import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toPause, toPlay } from "./gsap-animations";
import { usePlayerScrubbingBarInteractions } from "./player-scrubbingBar-logic";
import { updateBuffering, updateIsdragging, updatePlay } from "../../../../store/Slices/player-slice";
import { getTimeStamp } from "../../../../utilities/getTimestamp";
import { usePlayerProgressBarLogic } from "./player-progressBar-logic";

export const usePlayerDraggingLogic = () => {
  const mouseDownTracker = useRef();
  const isDragging = useRef(false);
  const chapters = useSelector((state) => state.player.chapters);
  const [updateScrubbingBar, previewCanvas, movePreviews] = usePlayerScrubbingBarInteractions();
  const [checkBufferedOnTrackChange, checkBuffered, clearIntervalOnTrackChange] = usePlayerBufferingState();
  const [updateBufferBar, updateProgressBar] = usePlayerProgressBarLogic();
  const dispatch = useDispatch();
  const curTime = useRef(Date.now());
  const timeDelay = 140;
  const wasPlaying = useRef(false);
  const timeoutRef2 = useRef();

  const updateRedDot = (currentTimeTracker) => {
    const videoRef = document.querySelector("#html5-player");
    const duration = chapters[chapters.length - 1].end;
    const redDotWrapperRef = document.querySelector(".red-dot-wrapper");
    const innerChapterContainerRef = document.querySelector(".chapters-container");
    let currentTime;
    if (typeof currentTimeTracker === "number") {
      currentTime = currentTimeTracker;
    } else {
      currentTime = videoRef.currentTime;
    }

    if (currentTime >= 0 && currentTime <= duration) {
      const progressBarRefs = document.querySelectorAll(".progress.bar");
      const style = getComputedStyle(document.documentElement);
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
    const timeContainer = document.querySelector(".time-left-container");
    const duration = chapters[chapters.length - 1].end;
    const chapterContainers = document.querySelectorAll(".chapter-hover");
    const videoRef = document.querySelector("#html5-player");
    const redDotRef = document.querySelector(".red-dot");
    const style = getComputedStyle(document.documentElement);
    const currentIndex = parseInt(style.getPropertyValue("--hoverChapterIndex").trim());
    const chapterDuration = chapters[currentIndex].end - chapters[currentIndex].start;
    const { left, width } = chapterContainers[currentIndex].getBoundingClientRect();
    const position = e.clientX - left;
    const ratio = position / width;
    const timeOffset = ratio * chapterDuration;
    const currentTime = Math.min(Math.max(chapters[currentIndex].start + timeOffset, 0), duration);
    if (isNaN(currentTime)) {
      return;
    }
    videoRef.currentTime = currentTime;
    document.documentElement.style.setProperty("--dragTime", `${currentTime}`);
    redDotRef.style.scale = chapters.length === 1 ? 1 : 1.5;
    timeContainer.textContent = getTimeStamp(Math.round(currentTime));
    updateProgressBar();
    updateRedDot(currentTime);
  };

  const handleDrag = (e) => {
    const timeContainer = document.querySelector(".time-left-container");
    const duration = chapters[chapters.length - 1].end;
    const chapterTitleContainer = document.querySelector(".chapter-title-container");
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
    const currentTime = Math.min(Math.max(chapters[currentIndex].start + timeOffset, 0), duration);
    if (isNaN(currentTime)) {
      return;
    }
    document.documentElement.style.setProperty("--dragTime", `${currentTime}`);

    previewCanvas(currentTime);
    movePreviews(e, currentIndex);

    redDotRef.style.scale = chapters.length === 1 ? 1 : 1.5;
    chapters.forEach((chapter, index) => {
      if (chapter.start <= currentTime && currentTime < chapter.end) {
        const chapterPaddingLeft = chapterPadding[index].getBoundingClientRect().left;
        const chapterPaddingWidth = chapterPadding[index].getBoundingClientRect().width;
        const position = e.clientX - chapterPaddingLeft;
        progressBarRefs[index].style.width = `${Math.min(Math.max(position, 0), chapterPaddingWidth)}px`;
        const curIndex = progressBarRefs[index].getAttribute("dataIndex");
        document.documentElement.style.setProperty("--currentChapterIndex", `${curIndex}`);
        document.documentElement.style.setProperty("--hoverChapterIndex", `${curIndex}`);
        redDotRef.setAttribute("dataIndex", `${curIndex}`);
        redDotWrapperRef.setAttribute("dataIndex", `${curIndex}`);
        chapterPadding[index].classList.add("drag-expand");
        chapterTitleContainer.textContent = chapters[index].title;
        timeContainer.textContent = getTimeStamp(Math.round(currentTime));
      } else if (chapter.end <= currentTime) {
        progressBarRefs[index].style.width = `100%`;
        if (currentIndex - index === 0) return;

        chapterPadding[index].classList.remove("drag-expand");
        // updateRedDot(currentTime);
      } else {
        progressBarRefs[index].style.width = `0%`;
        if (currentIndex - index === 0) return;

        chapterPadding[index].classList.remove("drag-expand");
        // updateRedDot(currentTime);
      }
    });
    // chapterPadding[currentIndex].classList.add("drag-expand");

    updateRedDot(currentTime);
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

  const addEventListeners = () => {
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchmove", handleTouchDrag);
    window.addEventListener("touchend", stopDragging);
  };

  const stopDragging = (e) => {
    const innerChapterContainerRef = document.querySelector(".chapters-container");
    const videoRef = document.querySelector("#html5-player");
    const scrubbingPreviewContainer = document.querySelector(".scrubbing-preview-container");
    const style = getComputedStyle(document.documentElement);
    const hovering = style.getPropertyValue("--hovering").trim();
    const dragTime = parseFloat(style.getPropertyValue("--dragTime").trim());
    const timeDiff = Date.now() - curTime.current < timeDelay;
    document.documentElement.style.setProperty("--select", "");

    scrubbingPreviewContainer.classList.remove("show");

    if (mouseDownTracker.current && timeDiff) {
      clearTimeout(mouseDownTracker.current);
    } else if (!timeDiff) {
      videoRef.currentTime = dragTime;
    }

    if (wasPlaying.current === true) {
      videoRef.play();
      dispatch(updatePlay(true));
    }
    isDragging.current = false;

    if (hovering === "false" || e.touches) {
      const chaptersContainers = document.querySelectorAll(".chapter-padding");
      chaptersContainers.forEach((chaptersContainer, index) => {
        chaptersContainer.classList.remove("drag-expand");
      });

      resetDot();
    }

    innerChapterContainerRef.classList.remove("drag-expand");

    dispatch(updateBuffering(true));
    dispatch(updateIsdragging(false));
    checkBuffered();
    checkBufferedOnTrackChange();

    removeEventListeners();
  };

  const startDrag = (e) => {
    const isTouching = e.touches ? e.touches.length > 0 : false;
    const innerChapterContainerRef = document.querySelector(".chapters-container");
    const videoRef = document.querySelector("#html5-player");
    document.documentElement.style.setProperty("--select", "none");
    if (isTouching) {
      handleClick(e.touches[0]);
    } else {
      handleClick(e);
    }

    wasPlaying.current = !videoRef.paused;

    curTime.current = Date.now();
    addEventListeners();
    mouseDownTracker.current = setTimeout(() => {
      videoRef.pause();
      dispatch(updatePlay(false));
      isDragging.current = true;
      dispatch(updateIsdragging(true));

      if (isTouching) {
        handleDrag(e.touches);

        const style = getComputedStyle(document.documentElement);
        const currentIndex = parseInt(style.getPropertyValue("--currentChapterIndex").trim());
        document.documentElement.style.setProperty("--hoverChapterIndex", `${currentIndex}`);
      } else {
        handleDrag(e);
      }

      clearIntervalOnTrackChange();
      videoRef.style.visibility = "hidden";
      innerChapterContainerRef.classList.add("drag-expand");
    }, timeDelay);
  };

  const resetDot = () => {
    const redDotRef = document.querySelector(".red-dot");
    document.documentElement.style.setProperty("--hovering", `false`);
    redDotRef.style.scale = 0;
  };

  return [startDrag, stopDragging, handleClick, handleDrag, updateRedDot, resetDot, isDragging, removeEventListeners];
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
    const video = videoRef;
    const currentTime = video.currentTime;
    const buffered = video.buffered;
    if (buffered.length > 0) {
      // const lastBufferIndex = buffered.length - 1;
      // const end = buffered.end(lastBufferIndex);

      const bufferGroups = [];
      let currentGroup = [buffered.start(0), buffered.end(0)];

      for (let i = 0; i < buffered.length; i++) {
        const start = buffered.start(i);
        const end = buffered.end(i);
        // console.log({ start: start }, { end: end });

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
        dispatch(updateBuffering(false));
        if (timeIntervalRef) {
          clearInterval(timeIntervalRef);
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
