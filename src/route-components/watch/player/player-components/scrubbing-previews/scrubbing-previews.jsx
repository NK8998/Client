import { useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";

export default function ScrubbingPreviews({ videoRef }) {
  const scrubbingContainerRef = useRef();
  const scrubbingImg = useRef();
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);
  const { aspect_ratio } = playingVideo;

  useLayoutEffect(() => {
    if (!fullScreen) {
      if (miniPlayer) {
        const width = 130;
        const height = width * (1 / aspect_ratio);
        scrubbingImg.current.style.width = `${width}px`;
        scrubbingImg.current.style.height = `${height}px`;
      } else if (!miniPlayer) {
        const width = 240;
        const height = width * (1 / aspect_ratio);
        scrubbingImg.current.style.width = `${width}px`;
        scrubbingImg.current.style.height = `${height}px`;
      }
    } else if (fullScreen) {
      const width = 300;
      const height = width * (1 / aspect_ratio);
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
