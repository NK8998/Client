import { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchWatchData, handleMiniPLayer, updateMiniPlayerBoolean } from "../store/Slices/watch-slice";
import { upadteLocationsArr } from "../store/Slices/app-slice";

export default function BareWatch({}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useSelector((state) => state.app.location);
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);

  useLayoutEffect(() => {
    const url = new URL(window.location.href);
    const currentRoute = url.pathname;
    const videoId = url.search.split("=")[1];

    if (!videoId) {
      navigate("/");
      return;
    }
    // fetch data and store in watchSlice
    dispatch(upadteLocationsArr(currentRoute));
    if (miniPlayer) {
      dispatch(handleMiniPLayer(false, currentRoute));
    }
    dispatch(updateMiniPlayerBoolean(false));

    if (location.length === 0) {
      dispatch(fetchWatchData(videoId, currentRoute, {}));
    }
  }, []);
  return <div className='bare-hidden-watch'></div>;
}
