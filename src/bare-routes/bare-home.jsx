import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchRecommendedVideos } from "../store/Slices/home-slice";

export default function BareHome() {
  const dispatch = useDispatch();

  useEffect(() => {
    // fetch data and store in homeSlices
    dispatch(fetchRecommendedVideos());
  }, []);

  return <div className='bare-hidden-home'></div>;
}
