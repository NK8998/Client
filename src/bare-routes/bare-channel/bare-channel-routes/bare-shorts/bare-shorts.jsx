import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchShortsContent } from "../../../../store/Slices/channel-slice";
import { useLocation } from "react-router-dom";

export default function BareShorts() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // fetch data and store in homeSlices
    dispatch(fetchShortsContent(location.pathname));
  }, []);

  return <div className='shorts-content'></div>;
}
