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
      <Link to={"/watch?v=DfYP6AooQ8H"} onClick={(e) => handleNavigation(e, "/watch?v=DfYP6AooQ8H")}>
        <div className='press me'>press me</div>
      </Link>
      <Link to={"/watch?v=QpZYoxRun3B"} onClick={(e) => handleNavigation(e, "/watch?v=QpZYoxRun3B")}>
        <div className='press me'>press me</div>
      </Link>
    </div>
  );
}
