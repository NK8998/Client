import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchLiveContent } from "../../../../store/Slices/channel-slice";

export default function BareLive() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // fetch data and store in homeSlices
    dispatch(fetchLiveContent(location.pathname));
  }, []);

  return <div className='live-content'></div>;
}
