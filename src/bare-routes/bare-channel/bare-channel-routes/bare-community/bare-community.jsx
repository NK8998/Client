import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchCommunityContent } from "../../../../store/Slices/channel-slice";

export default function BareCommunity() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // fetch data and store in homeSlices
    dispatch(fetchCommunityContent(location.pathname));
  }, []);

  return <div className='community-content'></div>;
}
