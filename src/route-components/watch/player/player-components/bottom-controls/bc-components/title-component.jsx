import { useSelector } from "react-redux";

export default function TopVideoComponent() {
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const { title } = playingVideo;
  return (
    <div className={`top-video-component ${fullScreen ? "visible" : ""}`}>
      <p className='title-card'>{title}</p>
      <div className=''></div>
    </div>
  );
}
