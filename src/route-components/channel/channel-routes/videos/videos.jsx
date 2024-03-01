import { useEffect } from "react";
import "./videos.css";
import { Link } from "react-router-dom";
import { useAppNavigation } from "../../../../utilities/navigation";
import { useSelector } from "react-redux";
export default function Videos() {
  useEffect(() => {});
  const handleNavigation = useAppNavigation();

  return (
    <div className='videos-content dynamic-tab-content'>
      <div className='board'></div>
      <Link to={"/watch?v=I938buiYN"} onClick={(e) => handleNavigation(e, "/watch?v=I938buiYN")}>
        <div className='press me'>press me</div>
      </Link>
      <Link to={"/watch?v=i94bjbYU"} onClick={(e) => handleNavigation(e, "/watch?v=i94bjbYU")}>
        <div className='press me'>press me</div>
      </Link>
    </div>
  );
}
