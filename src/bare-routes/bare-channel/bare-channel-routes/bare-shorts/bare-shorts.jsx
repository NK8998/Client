import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchTabContent } from "../../../../store/Slices/channel-slice";
import { useLocation } from "react-router-dom";

export default function BareShorts() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // fetch data and store in homeSlices
    dispatch(fetchTabContent(location.pathname, "shorts"));
  }, []);

  return <div className='shorts-content'></div>;
}
