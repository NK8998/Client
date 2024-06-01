import { useSelector } from "react-redux";
import { Exclamation } from "../../../../../assets/icons";

export default function PlayerBanner() {
  const notFound = useSelector((state) => state.watch.notFound);
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const { mpd_url } = playingVideo;

  return (
    <div className={`processing-banner ${mpd_url ? "hide" : ""}`}>
      <p className='processing-title'>
        {notFound ? (
          <span>This video is not available anymore</span>
        ) : (
          <span>
            <Exclamation /> Processing...
          </span>
        )}
      </p>
    </div>
  );
}
