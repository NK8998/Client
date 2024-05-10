import { useMemo } from "react";
import { formatCount, generateRandomInteger } from "./fomatCount";
import { getTimeUploaded } from "./getTimeUploaded";
import { removeLeadingZero } from "./getTimestamp";
import { Exclamation, VerticalDots } from "../assets/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchWatchData } from "../store/Slices/watch-slice";
import { useAppNavigation } from "./navigation";
import errorFallback from "../assets/fallback.jpg";
import processingImg from "../assets/processing.jpg";

export default function VideoComponent({ data }) {
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);
  const { mpd_url, duration_timestamp, possible_thumbnail_urls, title, display_name, handle, created_at, video_id, preferred_thumbnail_url } = data;
  const dispatch = useDispatch();
  const handleNavigation = useAppNavigation();
  const views = useMemo(() => {
    return formatCount(generateRandomInteger());
  }, [title]);

  const timeUploaded = useMemo(() => {
    return getTimeUploaded(created_at);
  }, [created_at]);
  return (
    <div className='browse-skeleton'>
      <div className='browse-skeleton-inner'>
        <Link
          to={`/watch?v=${video_id}`}
          onClick={(e) => {
            miniPlayer && e.preventDefault();
            dispatch(fetchWatchData(video_id, `/watch?v=${video_id}`, {}));
          }}
        >
          <div className='browse-video-upper'>
            {!mpd_url ? (
              <div className='processing-banner-home home-skeleton'>
                <img
                  loading='lazy'
                  src={
                    preferred_thumbnail_url
                      ? preferred_thumbnail_url
                      : possible_thumbnail_urls
                      ? possible_thumbnail_urls["thumbnailUrl-0"]
                      : processingImg
                  }
                  className='skeleton-thumbnail'
                />
                <p className='processing-title'>
                  <Exclamation />
                  Processing...
                </p>
              </div>
            ) : (
              <>
                <img
                  loading='lazy'
                  src={preferred_thumbnail_url ? preferred_thumbnail_url : possible_thumbnail_urls["thumbnailUrl-0"]}
                  alt='thumbnail'
                  className='skeleton-thumbnail'
                  onError={(e) => {
                    e.target.src = errorFallback;
                  }}
                />
                <div className='skeleton-timestamp'>
                  <p>{removeLeadingZero(duration_timestamp)}</p>
                </div>
              </>
            )}
          </div>
        </Link>
        <div className='browse-video-lower'>
          <div className='owner-pfp'></div>
          <div className='browse-middle-lower'>
            <Link
              to={`/watch?v=${video_id}`}
              onClick={(e) => {
                miniPlayer && e.preventDefault();
                dispatch(fetchWatchData(video_id, `/watch?v=${video_id}`, {}));
              }}
              className='skeleton-title'
            >
              <p className='skeleton-title'>{title}</p>
            </Link>
            <Link to={`/${handle}`} onClick={(e) => handleNavigation(e, `/${handle}`)}>
              <p className='owner-display-name'>{display_name}</p>
            </Link>
            <div className='skeleton-metrics'>
              <p className='views'>{views} views</p>
              <p className='skeleton-time-uploaded'>{timeUploaded}</p>
            </div>
          </div>
          <div className='browse-options'>
            <VerticalDots />
          </div>
        </div>
      </div>
    </div>
  );
}
