import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchVideosContent } from "../../../../store/Slices/channel-slice";
import { useLocation } from "react-router-dom";

export default function BareVideos() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // fetch data and store in homeSlices
    dispatch(fetchVideosContent(location.pathname));
  }, []);

  return <div className='videos-content'></div>;
}
