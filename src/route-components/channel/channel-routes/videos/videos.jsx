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
      <Link to={"/watch?v=fgj89bjloQ"} onClick={(e) => handleNavigation(e, "/watch?v=fgj89bjloQ")}>
        <div className='press me'>press me</div>
      </Link>
      <Link to={"/watch?v=ZMIjWdisZf4"} onClick={(e) => handleNavigation(e, "/watch?v=ZMIjWdisZf4")}>
        <div className='press me'>press me</div>
      </Link>
    </div>
  );
}
