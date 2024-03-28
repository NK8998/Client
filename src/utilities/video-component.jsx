import { useMemo } from "react";
import { formatCount, generateRandomInteger } from "./fomatCount";
import { getTimeUploaded } from "./getTimeUploaded";
import { removeLeadingZero } from "./getTimestamp";
import { VerticalDots } from "../assets/icons";
import { Link } from "react-router-dom";
import { useAppNavigation } from "./navigation";

export default function VideoComponent({ duration_timestamp, possible_thumbnail_urls, title, display_name, handle, created_at, video_id }) {
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
        <Link to={`/watch?v=${video_id}`} onClick={(e) => handleNavigation(e, `/watch?v=${video_id}`)}>
          <div className='browse-video-upper'>
            <img src={possible_thumbnail_urls["thumbnailUrl-0"]} alt='thumbnail' className='skeleton-thumbnail' />
            <div className='skeleton-timestamp'>
              <p>{removeLeadingZero(duration_timestamp)}</p>
            </div>
          </div>
        </Link>
        <div className='browse-video-lower'>
          <div className='owner-pfp'></div>
          <div className='browse-middle-lower'>
            <Link to={`/watch?v=${video_id}`} onClick={(e) => handleNavigation(e, `/watch?v=${video_id}`)} className='skeleton-title'>
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
