import { useRef } from "react";
import { useSelector } from "react-redux";
import { getTimeStamp } from "../../../../utilities/getTimestamp";

export const handleFocusingElements = (isFocusing) => {
  isFocusing.current = !isFocusing.current;
};
export const seekVideo = (newTime) => {
  const videoRef = document.querySelector(".html5-player");

  videoRef.currentTime = newTime;
};

export const usePlayerProgressBarLogic = () => {
  const chapters = useSelector((state) => state.player.chapters);
  const updateBufferBar = () => {
    const videoRef = document.querySelector(".html5-player");
    const buffered = videoRef.buffered;
    const currentTime = videoRef.currentTime;

    let bufferToUse = [0, 0];
    if (buffered.length > 0) {
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

      for (const group of bufferGroups) {
        if (currentTime >= group[0] && currentTime <= group[1]) {
          bufferToUse = group;
          break;
        }
      }
    }

    // if (!bufferToUse) return;
    const bufferBarRefs = document.querySelectorAll(".buffer.bar");
    const chapterContainers = document.querySelectorAll(".chapter-hover");
    const chapterPadding = document.querySelectorAll(".chapter-padding");

    if (!bufferBarRefs || !chapterContainers || !chapterPadding) return;
    bufferBarRefs.forEach((bufferBar) => {
      const index = bufferBar.getAttribute("dataIndex"); // get the data-index attribute
      const chapter = chapters[index]; // find the corresponding chapter
      if (!chapter) return;
      if (chapter.start <= bufferToUse[1] && chapter.end >= bufferToUse[1]) {
        const ratio = (bufferToUse[1] - chapter.start) / (chapter.end - chapter.start);
        const { width } = chapterContainers[index].getBoundingClientRect();
        const chapterPaddingWidth = chapterPadding[index].getBoundingClientRect().width;
        const widthInPixels = width * ratio;
        const newRatio = Math.max(Math.min(widthInPixels / chapterPaddingWidth, 1), 0);
        bufferBar.style.transform = `scaleX(${newRatio})`;
      } else if (chapter.end < bufferToUse[1]) {
        bufferBar.style.transform = `scaleX(${1})`;
      } else {
        bufferBar.style.transform = `scaleX(${0})`;
      }
    });
  };

  const updateProgressBar = (curTime) => {
    const videoRef = document.querySelector(".html5-player");
    const redDotRef = document.querySelector(".red-dot");
    const redDotWrapperRef = document.querySelector(".red-dot-wrapper");
    const timeContainer = document.querySelector(".time-left-container");
    const progressBarRefs = document.querySelectorAll(".progress.bar");
    const chapterContainers = document.querySelectorAll(".chapter-hover");
    const chapterPadding = document.querySelectorAll(".chapter-padding");
    const chapterTitleContainer = document.querySelector(".chapter-title-container.bottom");

    let currentTime = videoRef.currentTime;
    if (curTime && !isNaN(curTime) && typeof curTime === "number") {
      currentTime = curTime;
    }
    const timeStamp = getTimeStamp(Math.round(currentTime));
    timeContainer.textContent = timeStamp;

    if (chapters.length === 0 || !chapters || !progressBarRefs || !chapterContainers || !chapterPadding) return;
    progressBarRefs.forEach((progressBar, index) => {
      // const curIndex = progressBar.getAttribute("dataIndex");
      const chapter = chapters[index];
      if (!chapter) return;
      if (chapter.start <= currentTime && currentTime < chapter.end) {
        document.documentElement.style.setProperty("--currentChapterIndex", `${index}`);
        redDotRef.setAttribute("dataIndex", `${index}`);
        redDotWrapperRef.setAttribute("dataIndex", `${index}`);
        const ratio = (currentTime - chapter.start) / (chapter.end - chapter.start);
        const { width } = chapterContainers[index].getBoundingClientRect();
        const chapterPaddingWidth = chapterPadding[index].getBoundingClientRect().width;
        const widthInPixels = width * ratio;
        const newRatio = Math.max(Math.min(widthInPixels / chapterPaddingWidth, 1), 0);
        progressBar.style.transform = `scaleX(${newRatio})`;
        chapterTitleContainer.textContent = chapters[index].title;
      } else if (chapter.end <= currentTime) {
        progressBar.style.transform = `scaleX(${1})`;
      } else {
        progressBar.style.transform = `scaleX(${0})`;
      }
    });

    const style = getComputedStyle(document.documentElement);
    const hovering = style.getPropertyValue("--hovering").trim();
    // console.log(hovering);

    if (hovering === "true" && chapters.length > 1) {
      const hoveringChapterIndex = style.getPropertyValue("--hoverChapterIndex").trim();
      const currentChapterIndex = style.getPropertyValue("--currentChapterIndex").trim();
      if (hoveringChapterIndex === currentChapterIndex) {
        redDotRef.style.scale = 1.5;
      } else {
        redDotRef.style.scale = 1;
      }
    }
  };

  return { updateBufferBar, updateProgressBar };
};
