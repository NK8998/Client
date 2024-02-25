import { useEffect } from "react";
import "./videos.css";
import { Link } from "react-router-dom";
export default function Videos() {
  useEffect(() => {});

  return (
    <div className='videos-content dynamic-tab-content'>
      <div className='board'></div>
      <Link to={"/watch?v=I938buiYN"}>
        <div className='press me'>press me</div>
      </Link>
    </div>
  );
}
