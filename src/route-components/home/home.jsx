import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { handleSelectedVideo } from "../../store/Slices/home-slice";
import "./home.css";
import { useEffect } from "react";
import { updateLocation } from "../../store/Slices/app-slice";

export default function Home({ homeRef }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const currentRoute = window.location.pathname.split("?")[0];
    dispatch(updateLocation(currentRoute));
  }, []);
  return (
    <div className='home' ref={homeRef} id='home'>
      <div className='header'>
        <div className='filter-chip-bar'></div>
      </div>
      <div className='grid-rendrers'>
        <div className='pseudo-link'>
          <Link to={"/watch?v=I938buiYN"} onClick={() => dispatch(handleSelectedVideo("/watch?v=I938buiYN"))}>
            <div className='press me'>press me</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
