import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchTabContent } from "../../../../store/Slices/channel-slice";
import { useLocation } from "react-router-dom";
import { updateLastVisited } from "../../../../store/Slices/app-slice";

export default function BareShorts() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // fetch data and store in homeSlices
    dispatch(updateLastVisited(location.pathname));
    dispatch(fetchTabContent(location.pathname, "shorts"));
  }, []);

  return <div className='shorts-content'></div>;
}
