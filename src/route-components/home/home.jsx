import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import { useSelector } from "react-redux";
import { useAppNavigation } from "../../utilities/navigation";

export default function Home({ homeRef }) {
  const recommendedVideos = useSelector((state) => state.home.recommendedVideos);
  const handleNavigation = useAppNavigation();
  // console.log(recommendedVideos);
  return (
    <div className='home hidden' ref={homeRef} id='home'>
      <div className='header'>
        <div className='filter-chip-bar'></div>
      </div>
      <div className='grid-renderers'>
        <div className='pseudo-link'>
          <Link to={"/watch?v=fgj89bjloQ"} onClick={(e) => handleNavigation(e, `/watch?v=fgj89bjloQ`)}>
            <div className='press me'>press me</div>
          </Link>
          <Link to={"/@AbanPreach"} onClick={(e) => handleNavigation(e, `/@AbanPreach`)}>
            Aba n Preach
          </Link>
          <Link to={"/@WbeDevSimplified"} onClick={(e) => handleNavigation(e, `/@WbeDevSimplified`)}>
            WbeDevSimplified
          </Link>
        </div>
      </div>
    </div>
  );
}
