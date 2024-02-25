import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchFeaturedContent } from "../../../../store/Slices/channel-slice";

export default function BareFeatured() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // fetch data and store in homeSlices
    dispatch(fetchFeaturedContent(location.pathname));
  }, []);

  return <div className='featured-content'></div>;
}
