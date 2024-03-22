import { useState } from "react";
import { useSelector } from "react-redux";
import { getTimeStamp } from "../../../../utilities/getTimestamp";

export function usePlayerScrubbingBarInteractions() {
  const chapters = useSelector((state) => state.player.chapters);
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const { extraction_and_palette, palette_urls, aspect_ratio } = playingVideo;
  const settingsShowing = useSelector((state) => state.player.settingsShowing);
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);
  const fullScreen = useSelector((state) => state.watch.fullScreen);

  const updatePreviewLeft = (e) => {
    const scrubbingPreviewContainer = document.querySelector(".scrubbing-preview-container");
    const chapterContainerRef = document.querySelector(".chapters-absolute");
    const scrubbingPreviewContainerWidth = scrubbingPreviewContainer.clientWidth;
    const chaptersContainerWidth = chapterContainerRef.clientWidth;
    const chaptersContainerLeft = chapterContainerRef.getBoundingClientRect().left;
    const chaptersContainerRight = chapterContainerRef.getBoundingClientRect().right;
    const cursorPosition = e.clientX;
    const clientPosition = cursorPosition - chaptersContainerLeft;
    const percentage = (clientPosition / chaptersContainerWidth) * 100;
    let scrubbingLeft = `calc(${percentage}% - ${scrubbingPreviewContainerWidth / 2}px)`;
    const boundary = scrubbingPreviewContainerWidth / 2 + 10;
    if (clientPosition < boundary) {
      scrubbingLeft = `calc(0% + 10px)`;
    } else if (chaptersContainerRight - cursorPosition < boundary) {
      scrubbingLeft = `calc(100% - ${scrubbingPreviewContainerWidth + 10}px)`;
    }
    scrubbingPreviewContainer.style.left = scrubbingLeft;
  };

  const retrieveCurPalleteAndTile = (currentTime, element, dimensions) => {
    if (!aspect_ratio) return;
    const { width, height } = dimensions;
    const { paletteSize, extractionRate } = extraction_and_palette;

    const pallete = paletteSize * paletteSize;
    const timePerPallete = extractionRate * pallete;
    const currentPallete = Math.floor(currentTime / timePerPallete);
    // Get the total elapsed time within all palettes
    const elapsedTimeWithinCurrentPallete = currentTime - currentPallete * timePerPallete;

    const currentTile = Math.floor(elapsedTimeWithinCurrentPallete / extractionRate) + 1;

    const backgroundPallete = palette_urls[`palleteUrl-${currentPallete}`];

    const offsetX = ((currentTile - 1) % paletteSize) * width;
    const offsetY = Math.floor((currentTile - 1) / paletteSize) * height;
    element.style.backgroundSize = `${width * paletteSize}px ${height * paletteSize}px`;
    let backgroundImage = element.style.backgroundImage;
    let url = backgroundImage.slice(5, backgroundImage.length - 2);
    if (url !== backgroundPallete) {
      element.style.backgroundImage = `url(${backgroundPallete})`;
    }
    element.style.backgroundPosition = `-${offsetX}px -${offsetY}px`;
  };

  const previewCanvas = (currentTime) => {
    const playerOuter = document.querySelector(".player-outer");
    const previewImageBg = document.querySelector(".preview-image-bg");
    previewImageBg.classList.add("show");
    previewImageBg.style.visibility = "visible";
    const style = getComputedStyle(document.documentElement);

    let height;
    let width;
    if (!theatreMode) {
      // height = parseInt(style.getPropertyValue("--height").split("px")[0]);
      // width = parseInt(style.getPropertyValue("--width").split("px")[0]);
      const dimensions = playerOuter.getBoundingClientRect();
      width = dimensions.width;
      height = dimensions.height;
    } else if (theatreMode) {
      // const theatreHeight = parseInt(style.getPropertyValue("--theatreHeight").split("px")[0]);
      // const theatreWidth = parseInt(style.getPropertyValue("--theatreWidth").split("px")[0]);
      const dimensions = playerOuter.getBoundingClientRect();
      const theatreWidth = dimensions.width;
      const theatreHeight = dimensions.height;
      height = theatreWidth * aspect_ratio;
      width = theatreHeight * aspect_ratio;
      if (width > theatreWidth) {
        width = theatreWidth;
        height = width * (1 / aspect_ratio);
      }
      if (height > theatreHeight) {
        height = theatreHeight;
      }
    }
    if (miniPlayer) {
      width = 400;
      height = 400 * (1 / aspect_ratio);
    }
    if (fullScreen) {
      const dimensions = playerOuter.getBoundingClientRect();
      // width = parseInt(style.getPropertyValue("--theatreWidth").split("px")[0]);
      width = dimensions.width;
      height = width * (1 / aspect_ratio);
    }
    previewImageBg.style.height = `${height}px`;
    previewImageBg.style.width = `${width}px`;
    const dimensions = { width: width, height: height };

    retrieveCurPalleteAndTile(currentTime, previewImageBg, dimensions);
  };

  const movePreviews = (e, hoveringIndex) => {
    const previewTime = document.querySelector(".preview-time");
    const scrubbingPreview = document.querySelector(".preview-img-container");
    const chaptersContainers = document.querySelectorAll(".chapter-padding");
    const chapterDuration = chapters[hoveringIndex].end - chapters[hoveringIndex].start;
    const currentChapterLeft = chaptersContainers[hoveringIndex].getBoundingClientRect().left;
    const currentChapterWidth = chaptersContainers[hoveringIndex].getBoundingClientRect().width;
    const position = e.clientX - currentChapterLeft;
    const ratio = position / currentChapterWidth;
    const timeOffset = ratio * chapterDuration;
    const currentTime = chapters[hoveringIndex].start + timeOffset;
    const timeStamp = getTimeStamp(Math.trunc(currentTime));
    previewTime.textContent = timeStamp;
    const width = scrubbingPreview.clientWidth;
    const height = scrubbingPreview.clientHeight;
    const dimensions = { width: width, height: height };
    retrieveCurPalleteAndTile(currentTime, scrubbingPreview, dimensions);

    updatePreviewLeft(e);
  };

  const updateScrubbingBar = (e) => {
    const redDotRef = document.querySelector(".red-dot");
    const scrubbingPreviewContainer = document.querySelector(".scrubbing-preview-container");
    if (!settingsShowing) {
      scrubbingPreviewContainer.classList.add("show");
    }

    const hoveringIndex = e.target.getAttribute("dataIndex");
    document.documentElement.style.setProperty("--hoverChapterIndex", `${hoveringIndex}`);

    if (hoveringIndex) {
      movePreviews(e, hoveringIndex);
    }

    document.documentElement.style.setProperty("--hovering", `true`);

    const style = getComputedStyle(document.documentElement);

    const hoveringChapterIndex = style.getPropertyValue("--hoverChapterIndex").trim();
    const currentChapterIndex = style.getPropertyValue("--currentChapterIndex").trim();
    if (hoveringChapterIndex === currentChapterIndex && chapters.length > 1) {
      redDotRef.style.scale = 1.5;
    } else {
      redDotRef.style.scale = 1;
    }

    const chaptersContainersRefs = document.querySelectorAll(".chapter-padding");
    const scrubbingBarRefs = document.querySelectorAll(".scrubbing.bar");

    chaptersContainersRefs.forEach((chapterContainer, index) => {
      const right = chapterContainer.getBoundingClientRect().right;
      const left = chapterContainer.getBoundingClientRect().left;

      if (left <= e.clientX && e.clientX <= right) {
        const chapterWidth = ((e.clientX - left) / (right - left)) * 100;
        scrubbingBarRefs[index].style.width = `${chapterWidth}%`;
        document.documentElement.style.setProperty("--hoverChapterIndex", `${index}`);
      } else if (right < e.clientX) {
        scrubbingBarRefs[index].style.width = `100%`;
      } else {
        scrubbingBarRefs[index].style.width = `0%`;
      }
    });
  };
  return [updateScrubbingBar, previewCanvas, movePreviews, retrieveCurPalleteAndTile];
}
