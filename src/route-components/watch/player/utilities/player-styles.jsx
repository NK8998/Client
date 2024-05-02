import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { usePlayerProgressBarLogic } from "./player-progressBar-logic";

export const usePlayerStyles = () => {
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);
  const chapters = useSelector((state) => state.player.chapters);
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const { aspect_ratio } = playingVideo;

  useEffect(() => {
    applyChapterStyles();
  }, [fullScreen]);

  function applyChapterStyles() {
    const chaptersContainers = document.querySelectorAll(".chapter-padding");
    const hoverBars = document.querySelectorAll(".chapter-hover");
    const innerChapterContainerRef = document.querySelector(".chapters-container");
    // console.log("running");
    let totalWidth = 0;
    const chapterContainerRefWidth = miniPlayer === true ? 400 : innerChapterContainerRef.clientWidth;

    if (chapters.length === 0) return;
    chaptersContainers.forEach((chaptersContainer, index) => {
      const calculatedPercentage = ((chapters[index].end - chapters[index].start) / chapters[chapters.length - 1].end) * 100;
      let width = Math.trunc((calculatedPercentage / 100) * chapterContainerRefWidth);
      totalWidth += width;
      let chapterWidth = width;

      if (chapters.length > 1 && index !== chapters.length - 1) {
        fullScreen ? (width = Math.max(width - 3, 1)) : (width = Math.max(width - 2, 1));
      } else if (chapters.length > 1 && index === chapters.length - 1) {
        width += chapterContainerRefWidth - totalWidth;
        chapterWidth += chapterContainerRefWidth - totalWidth;
      }
      hoverBars[index].style.width = `${chapterWidth}px`;
      chaptersContainer.style.width = `${width}px`;
    });
  }

  const calculateWidth = () => {
    const root = document.querySelector("#root");
    const secondaryRef = document.querySelector(".secondary.content");
    if (!root) return;

    let secondaryRefWidth = 0;
    if (secondaryRef) {
      secondaryRefWidth = secondaryRef.clientWidth;
    }

    const aspectRatio = aspect_ratio > 1.1 ? aspect_ratio : 16 / 9;
    const windowWidth = root.clientWidth;
    const windowHeight = window.innerHeight;
    const gaps = window.innerWidth >= 1040 ? 64 : 46;
    const maxVideoHeight = (73.5 * window.innerHeight) / 100;
    const remainingSpace = windowWidth - (gaps + secondaryRefWidth);
    // const aspect_ratio = wideScreen ? 1920 / 1080 : 16 / 9;

    let videoHeight = remainingSpace * aspectRatio > maxVideoHeight ? maxVideoHeight : remainingSpace * aspectRatio;
    let videoWidth = videoHeight * aspectRatio;

    // Check if the videoWidth is greater than the remainingSpace
    if (videoWidth > remainingSpace) {
      // Adjust the videoWidth and videoHeight to fit the remaining space
      videoWidth = remainingSpace;
      videoHeight = videoWidth * (1 / aspectRatio);
    }

    if (videoWidth >= 1280) {
      videoWidth = 1280;
      videoHeight = videoWidth * (1 / aspectRatio);
    }

    // console.log({ remainingSpace });
    // console.log({ videoHeight, videoWidth });
    document.documentElement.style.setProperty("--height", `${Math.round(videoHeight)}px`);
    document.documentElement.style.setProperty("--width", `${Math.round(videoWidth)}px`);
    const newRatio = 16 / 9;
    const theatreWidth = windowWidth;
    const calculatedHeight = windowWidth * (1 / newRatio);
    const maxHeight = 0.795 * windowHeight;
    let theatreHeight = Math.trunc(calculatedHeight > maxHeight ? maxHeight : calculatedHeight);
    if (theatreHeight < 0.55 * window.screen.height) {
      theatreHeight = Math.trunc(0.55 * window.screen.height);
    }

    document.documentElement.style.setProperty("--theatreHeight", `${Math.trunc(theatreHeight)}px`);
    document.documentElement.style.setProperty("--theatreWidth", `${Math.trunc(theatreWidth - 1)}px`);
    document.documentElement.style.setProperty("--fullScreenHeight", `${window.screen.height}px`);
  };

  return [applyChapterStyles, calculateWidth];
};
