import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function VideoNotFound() {
  const location = useSelector((state) => state.app.location);
  const isWatchpage = location.includes("watch");

  return isWatchpage ? (
    <div className='not-found'>
      <div className='not-found-inner'>
        <img src='https://www.youtube.com/img/desktop/unavailable/unavailable_video_dark_theme.png' alt='not-found-banner' />
        <p>This video isn't available anymore</p>
        <Link to={"/"}>GO TO HOME</Link>
      </div>
    </div>
  ) : (
    <></>
  );
}
