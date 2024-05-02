import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { VideoIcon } from "../../../../assets/icons";

export default function UserRoleInfo() {
  const { handle } = useSelector((state) => state.watch.playingVideo);
  return (
    <div className='user-role-row'>
      <Link to={`/${handle}/videos`} className='uploader-link'>
        <div className='uploader-link-inner'>
          <VideoIcon /> Videos
        </div>
      </Link>
    </div>
  );
}
