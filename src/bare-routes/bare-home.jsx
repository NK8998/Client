import { useEffect, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchRecommendedVideos } from "../store/Slices/home-slice";
import { updateLastVisited } from "../store/Slices/app-slice";

export default function BareHome() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    // fetch data and store in homeSlices
    dispatch(updateLastVisited("/"));
    dispatch(fetchRecommendedVideos());
  }, []);

  return <div className='bare-hidden-home'></div>;
}
