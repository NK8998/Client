import { useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";

export default function ScrubbingPreviews({ videoRef }) {
  const scrubbingContainerRef = useRef();
  const scrubbingImg = useRef();
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);
  const { aspect_ratio } = playingVideo;

  const calculateWidthAndHeight = (widthVar) => {
    let width = widthVar;
    let height = width * (1 / aspect_ratio);

    if (!fullScreen) {
      if (height > 270) {
        height = 270;
        width = height * aspect_ratio;
      }
    } else {
      if (height > 420) {
        height = 420;
        width = height * aspect_ratio;
      }
    }

    return { width, height };
  };

  useLayoutEffect(() => {
    scrubbingImg.current.style.aspectRatio = aspect_ratio;
    if (!fullScreen) {
      if (miniPlayer) {
        const { width, height } = calculateWidthAndHeight(130);
        scrubbingImg.current.style.width = `${width}px`;
        scrubbingImg.current.style.height = `${height}px`;
      } else if (!miniPlayer) {
        const { width, height } = calculateWidthAndHeight(240);
        scrubbingImg.current.style.width = `${width}px`;
        scrubbingImg.current.style.height = `${height}px`;
      }
    } else if (fullScreen) {
      const { width, height } = calculateWidthAndHeight(400);
      scrubbingImg.current.style.width = `${width}px`;
      scrubbingImg.current.style.height = `${height}px`;
    }
  }, [fullScreen, aspect_ratio, miniPlayer]);

  const getBackground = () => {};

  return (
    <div className='scrubbing-preview-container' ref={scrubbingContainerRef}>
      <div className='preview-img-container' ref={scrubbingImg}></div>
      <div className='preview-time-container'>
        <p className='preview-time'></p>
      </div>
    </div>
  );
}
