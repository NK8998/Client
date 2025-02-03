import { useEffect, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchRecommendedVideos } from "../store/Slices/home-slice";
import { updateLastVisited } from "../store/Slices/app-slice";
import { Helmet } from "react-helmet";

export default function BareHome() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    // fetch data and store in homeSlices
    dispatch(updateLastVisited("/"));
    dispatch(fetchRecommendedVideos());
  }, []);

  return (
    <div className='bare-hidden-home'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>StreamGrid</title>
        <link rel='canonical' href='http://mysite.com/example' />
        <meta name='description' content='browse videos' />
      </Helmet>
    </div>
  );
}
