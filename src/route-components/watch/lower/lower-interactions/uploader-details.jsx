import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatCount, generateRandomInteger } from "../../../../utilities/fomatCount";

export default function UploderDetails() {
  const { pfp_url, handle, display_name } = useSelector((state) => state.watch.playingVideo);
  const subs = formatCount(generateRandomInteger());
  return (
    <div className='uploader-details'>
      <Link to={`/${handle}`}>
        <img className='uploader-pfp' src={pfp_url} alt='uploader-pfp' />
      </Link>
      <div className='uploder-detils-right'>
        <Link to={`/${handle}`}>
          <div className='uploder-details-name'>{display_name}</div>
        </Link>
        <div className='uploder-subscribers'>{subs} subscribers</div>
      </div>
    </div>
  );
}
