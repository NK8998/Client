import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchWatchData } from "../store/Slices/watch-slice";

export default function BareWatch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const currentRoute = url.pathname;
    const videoId = url.search.split("=")[1];

    if (!videoId) {
      navigate("/");
      return;
    }
    // fetch data and store in watchSlice

    dispatch(fetchWatchData(videoId, currentRoute));
  }, []);
  return <div className='bare-hidden-watch'></div>;
}
