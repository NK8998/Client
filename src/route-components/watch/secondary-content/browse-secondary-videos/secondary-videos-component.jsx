import { useMemo } from "react";
import { VerticalDots } from "../../../../assets/icons";
import { formatCount, generateRandomInteger } from "../../../../utilities/fomatCount";
import { getTimeUploaded } from "../../../../utilities/getTimeUploaded";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchWatchData } from "../../../../store/Slices/watch-slice";

export default function SecondaryVideoComponent({ data }) {
  const { duration_timestamp, possible_thumbnail_urls, title, display_name, handle, created_at, video_id, preferred_thumbnail_url } = data;
  const dispatch = useDispatch();
  const views = useMemo(() => {
    return formatCount(generateRandomInteger());
  }, [title]);

  const timeUploaded = useMemo(() => {
    return getTimeUploaded(created_at);
  }, [created_at]);
  return (
    <div className='secondary-skeleton'>
      <Link
        to={`/watch?v=${video_id}`}
        onClick={() => dispatch(fetchWatchData(video_id, `/watch?v=${video_id}`, data))}
        className='skeleton-inner-link'
      >
        <div className='secondary-skeleton-inner'>
          <div className='secondary-skeleton-left'>
            <img
              src={`${preferred_thumbnail_url ? preferred_thumbnail_url : possible_thumbnail_urls["thumbnailUrl-0"]}`}
              alt='skeleton-thumbnail'
              className='secondary-skeleton-thumbnail'
            />
          </div>
          <div className='secondary-skeleton-middle'>
            <p className='secondary-skeleton-title'>{title}</p>
            <p className='secondary-skeleton-owner'>{display_name}</p>
            <div className='secondary-skeleton-metrics'>
              <p className='secondary-skeleton-views'>{views} views</p>
              <p className='secondary-skeleton-uploaded-at'>{timeUploaded}</p>
            </div>
          </div>
        </div>
      </Link>
      <div className='secondary-skeleton-right'>
        <VerticalDots />
      </div>
    </div>
  );
}
