import { useRef } from "react";
import { useSelector } from "react-redux";
import { toPause, toPlay } from "./gsap-animations";
import { usePlayerScrubbingBarInteractions } from "./player-scrubbingBar-logic";

export const usePlayerDraggingLogic = () => {
  const mouseDownTracker = useRef();
  const isDragging = useRef(0);
  const currentTimeTracker = useRef(0);
  const chapters = useSelector((state) => state.player.chapters);
  const play = useSelector((state) => state.player.play);
  const [updateScrubbingBar, previewCanvas, movePreviews] = usePlayerScrubbingBarInteractions();

  const updateRedDot = (currentTimeTracker) => {
    const videoRef = document.querySelector("#html5-player");
    const redDotWrapperRef = document.querySelector(".red-dot-wrapper");
    const innerChapterContainerRef = document.querySelector(".chapters-container");
    if (chapters.length === 0) return;
    const endThreshold = Math.abs(videoRef.currentTime - chapters[chapters.length - 1].end);
    let currentTime;
    if (typeof currentTimeTracker === "number") {
      currentTime = currentTimeTracker;
    } else {
      currentTime = endThreshold <= 0.5 ? chapters[chapters.length - 1].end : videoRef.currentTime;
    }

    const progreeBarRefs = document.querySelectorAll(".progress.bar");
    if (currentTime >= chapters[0].start && currentTime <= chapters[chapters.length - 1].end) {
      progreeBarRefs.forEach((progressBar) => {
        const curIndex = progressBar.getAttribute("dataIndex");
        const chapter = chapters[curIndex];

        if (chapter.start <= currentTime && chapter.end >= currentTime) {
          const position = progressBar.getBoundingClientRect().right - innerChapterContainerRef.getBoundingClientRect().left;
          redDotWrapperRef.style.transform = `translateX(${position}px)`;
        }
      });
    } else if (currentTime < chapters[0].start) {
      const position = 0;
      redDotWrapperRef.style.transform = `translateX(${position}px)`;
    } else if (currentTime > chapters[chapters.length - 1].end) {
      const position = innerChapterContainerRef.clientWidth;
      redDotWrapperRef.style.transform = `translateX(${position}px)`;
    }
  };

  const handleClick = (e) => {
    checkBufferedOnTrackChange();
    const videoRef = document.querySelector("#html5-player");
    const redDotRef = document.querySelector(".red-dot");
    const chaptersContainers = document.querySelectorAll(".chapter-padding");
    const progressBarRefs = document.querySelectorAll(".progress.bar");
    const style = getComputedStyle(document.documentElement);
    const currentIndex = parseInt(style.getPropertyValue("--hoverChapterIndex").trim());
    const chapterDuration = chapters[currentIndex].end - chapters[currentIndex].start;
    const currentChapterLeft = chaptersContainers[currentIndex].getBoundingClientRect().left;
    const currentChapterWidth = chaptersContainers[currentIndex].getBoundingClientRect().width;
    const position = e.clientX - currentChapterLeft;
    const ratio = position / currentChapterWidth;
    const timeOffset = ratio * chapterDuration;
    const currentTime = chapters[currentIndex].start + timeOffset;
    videoRef.currentTime = currentTime;
    // console.log(currentTime);

    redDotRef.style.scale = chapters.length === 1 ? 1 : 1.5;
    chapters.forEach((chapter, index) => {
      if (chapter.start <= currentTime && currentTime <= chapter.end) {
        const chapterWidth = ((currentTime - chapter.start) / (chapter.end - chapter.start)) * 100;
        progressBarRefs[index].style.width = `${chapterWidth}%`;
        const curIndex = progressBarRefs[index].getAttribute("dataIndex");
        document.documentElement.style.setProperty("--currentChapterIndex", `${curIndex}`);
        document.documentElement.style.setProperty("--hoverChapterIndex", `${curIndex}`);
        chaptersContainers[index].classList.add("drag-expand");
      } else if (chapter.end < currentTime) {
        progressBarRefs[index].style.width = `100%`;
        chaptersContainers[index].classList.remove("drag-expand");
      } else {
        progressBarRefs[index].style.width = `0%`;
        chaptersContainers[index].classList.remove("drag-expand");
      }
    });
    updateRedDot(currentTime);
  };

  const handleDrag = (e) => {
    const redDotRef = document.querySelector(".red-dot");
    checkBufferedOnTrackChange();
    const style = getComputedStyle(document.documentElement);
    const chaptersContainers = document.querySelectorAll(".chapter-padding");
    const progressBarRefs = document.querySelectorAll(".progress.bar");
    const currentIndex = parseInt(style.getPropertyValue("--hoverChapterIndex").trim());
    const chapterDuration = chapters[currentIndex].end - chapters[currentIndex].start;
    const currentChapterLeft = chaptersContainers[currentIndex].getBoundingClientRect().left;
    const currentChapterWidth = chaptersContainers[currentIndex].getBoundingClientRect().width;
    const position = e.clientX - currentChapterLeft;
    const ratio = position / currentChapterWidth;
    const timeOffset = ratio * chapterDuration;
    const currentTime = chapters[currentIndex].start + timeOffset;
    previewCanvas(currentTime);
    movePreviews(e, currentIndex);
    currentTimeTracker.current = currentTime;

    redDotRef.style.scale = chapters.length === 1 ? 1 : 1.5;

    chapters.forEach((chapter, index) => {
      if (chapter.start <= currentTime && currentTime <= chapter.end) {
        const chapterWidth = ((currentTime - chapter.start) / (chapter.end - chapter.start)) * 100;
        progressBarRefs[index].style.width = `${chapterWidth}%`;
        const curIndex = progressBarRefs[index].getAttribute("dataIndex");
        document.documentElement.style.setProperty("--currentChapterIndex", `${curIndex}`);
        document.documentElement.style.setProperty("--hoverChapterIndex", `${curIndex}`);

        chaptersContainers[index].classList.add("drag-expand");
      } else if (chapter.end < currentTime) {
        progressBarRefs[index].style.width = `100%`;
        chaptersContainers[index].classList.remove("drag-expand");
        // updateRedDot(currentTime);
      } else {
        progressBarRefs[index].style.width = `0%`;
        chaptersContainers[index].classList.remove("drag-expand");
        // updateRedDot(currentTime);
      }
    });
    updateRedDot(currentTime);
  };

  const stopDragging = () => {
    checkBufferedOnTrackChange();
    const innerChapterContainerRef = document.querySelector(".chapters-container");
    const videoRef = document.querySelector("#html5-player");
    const scrubbingPreviewContainer = document.querySelector(".scrubbing-preview-container");
    const previewImageBg = document.querySelector(".preview-image-bg");
    previewImageBg.classList.remove("show");
    document.documentElement.style.setProperty("--select", "");
    const style = getComputedStyle(document.documentElement);
    if (mouseDownTracker.current) {
      clearTimeout(mouseDownTracker.current);
    }
    videoRef.currentTime = currentTimeTracker.current;
    isDragging.current = false;
    scrubbingPreviewContainer.classList.remove("show");
    if (play) {
      videoRef.play();
      toPlay();
    }
    videoRef.style.visibility = "visible";
    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", stopDragging);

    setTimeout(() => {
      const chaptersContainers = document.querySelectorAll(".chapter-padding");
      chaptersContainers.forEach((chaptersContainer, index) => {
        chaptersContainer.classList.remove("drag-expand");
      });
    }, 30);

    const hovering = style.getPropertyValue("--hovering").trim();
    if (hovering === "false") {
      resetDot();
    }
    innerChapterContainerRef.classList.remove("drag-expand");
  };

  const startDrag = (e) => {
    const innerChapterContainerRef = document.querySelector(".chapters-container");
    const videoRef = document.querySelector("#html5-player");
    document.documentElement.style.setProperty("--select", "none");
    mouseDownTracker.current = setTimeout(() => {
      handleDrag(e);
      videoRef.pause();
      toPause();
      isDragging.current = true;
      videoRef.style.visibility = "hidden";
      innerChapterContainerRef.classList.add("drag-expand");
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", stopDragging);
    }, 130);
  };

  const resetDot = () => {
    const redDotRef = document.querySelector(".red-dot");
    document.documentElement.style.setProperty("--hovering", `false`);
    redDotRef.style.scale = 0;
  };

  return [startDrag, stopDragging, handleClick, handleDrag, updateRedDot, resetDot, isDragging];
};

let timeIntervalRef;

export const checkBufferedOnTrackChange = () => {
  if (timeIntervalRef) {
    clearInterval(timeIntervalRef);
  }

  timeIntervalRef = setInterval(() => {
    checkBuffered();
  }, 250);
};

export const checkBuffered = () => {
  // console.log("running");
  const videoRef = document.querySelector("#html5-player");
  const spinnerRef = document.querySelector(".player-spinner");
  if (!videoRef) return;
  const video = videoRef;
  const currentTime = video.currentTime;
  if (video.buffered.length > 0) {
    const lastBufferIndex = video.buffered.length - 1;
    const end = video.buffered.end(lastBufferIndex);
    if (end > currentTime && end - currentTime > 2) {
      spinnerRef.classList.remove("visible");
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