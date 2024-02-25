import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchPlayListsContent } from "../../../../store/Slices/channel-slice";

export default function BarePlaylists() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // fetch data and store in homeSlices
    dispatch(fetchPlayListsContent(location.pathname));
  }, []);
  return <div className='playlists-content'></div>;
}
