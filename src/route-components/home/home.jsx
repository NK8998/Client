import { Link } from "react-router-dom";
import "./home.css";
import { useSelector } from "react-redux";

export default function Home({ homeRef }) {
  const recommendedVideos = useSelector((state) => state.home.recommendedVideos);

  // console.log(recommendedVideos);

  return (
    <div className='home hidden' ref={homeRef} id='home'>
      <div className='header'>
        <div className='filter-chip-bar'></div>
      </div>
      <div className='grid-renderers'>
        <div className='pseudo-link'>
          <Link to={"/watch?v=I938buiYN"}>
            <div className='press me'>press me</div>
          </Link>
          <Link to={"/@AbanPreach"}>Aba n Preach</Link>
          <Link to={"/@WbeDevSimplified"}>WbeDevSimplified</Link>
        </div>
      </div>
    </div>
  );
}
