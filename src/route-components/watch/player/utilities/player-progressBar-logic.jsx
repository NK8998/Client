import { useSelector } from "react-redux";

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
      let bufferToUse;
      for (const group of bufferGroups) {
        if (currentTime >= group[0] && currentTime <= group[1]) {
          bufferToUse = group;
          break;
        }
      }
      if (!bufferToUse) return;
      const bufferBarRefs = document.querySelectorAll(".buffer.bar");

      bufferBarRefs.forEach((bufferBar) => {
        const index = bufferBar.getAttribute("dataIndex"); // get the data-index attribute
        const chapter = chapters[index]; // find the corresponding chapter

        if (chapter.start <= bufferToUse[1] && chapter.end >= bufferToUse[1]) {
          const chapterWidth = ((bufferToUse[1] - chapter.start) / (chapter.end - chapter.start)) * 100;
          bufferBar.style.width = `${chapterWidth}%`;
        } else if (chapter.end < bufferToUse[1]) {
          bufferBar.style.width = `100%`;
        } else {
          bufferBar.style.width = `0%`;
        }
      });
    }
  };

  const updateProgressBar = () => {
    const videoRef = document.querySelector(".html5-player");
    const redDotRef = document.querySelector(".red-dot");
    const currentTime = videoRef.currentTime;

    const progressBarRefs = document.querySelectorAll(".progress.bar");

    progressBarRefs.forEach((progressBar) => {
      const curIndex = progressBar.getAttribute("dataIndex");
      const chapter = chapters[curIndex];
      if (chapter.start <= currentTime && chapter.end >= currentTime) {
        document.documentElement.style.setProperty("--currentChapterIndex", `${curIndex}`);
        const chapterWidth = ((currentTime - chapter.start) / (chapter.end - chapter.start)) * 100;
        progressBar.style.width = `${chapterWidth}%`;
      } else if (chapter.end < currentTime) {
        progressBar.style.width = `100%`;
      } else {
        progressBar.style.width = `0%`;
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

  return [updateBufferBar, updateProgressBar];
};
