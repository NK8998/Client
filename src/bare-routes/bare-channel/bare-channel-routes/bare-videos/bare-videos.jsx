import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchTabContent } from "../../../../store/Slices/channel-slice";
import { useLocation } from "react-router-dom";
import { upadteLocationsArr } from "../../../../store/Slices/app-slice";

export default function BareVideos() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // fetch data and store in homeSlices
    dispatch(upadteLocationsArr(location.pathname));

    dispatch(fetchTabContent(location.pathname, "videos"));
  }, []);

  return <div className='videos-content'></div>;
}
