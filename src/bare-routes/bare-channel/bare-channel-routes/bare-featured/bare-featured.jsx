import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { fetchTabContent } from "../../../../store/Slices/channel-slice";
import { updateLastVisited } from "../../../../store/Slices/app-slice";

export default function BareFeatured() {
  const dispatch = useDispatch();
  const { channel } = useParams();
  const currentRoute = `/${channel}/featured`;
  useEffect(() => {
    // fetch data and store in homeSlices
    dispatch(updateLastVisited(currentRoute));
    dispatch(fetchTabContent(currentRoute, "featured"));
  }, []);

  return <div className='featured-content'></div>;
}
