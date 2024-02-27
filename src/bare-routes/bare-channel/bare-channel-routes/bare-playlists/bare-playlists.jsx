import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchTabContent } from "../../../../store/Slices/channel-slice";
import { upadteLocationsArr } from "../../../../store/Slices/app-slice";

export default function BarePlaylists() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // fetch data and store in homeSlices
    dispatch(upadteLocationsArr(location.pathname));
    dispatch(fetchTabContent(location.pathname, "playlists"));
  }, []);
  return <div className='playlists-content'></div>;
}
