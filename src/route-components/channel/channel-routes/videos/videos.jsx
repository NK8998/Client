import { useEffect } from "react";
import "./videos.css";
import { Link } from "react-router-dom";
import { useAppNavigation } from "../../../../utilities/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchWatchData } from "../../../../store/Slices/watch-slice";
export default function Videos() {
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);
  const dispatch = useDispatch();
  useEffect(() => {});
  const handleNavigation = useAppNavigation();

  return (
    <div className='videos-content dynamic-tab-content'>
      <div className='board'></div>
      <Link
        to={"/watch?v=A9Bmny46rj2i"}
        onClick={(e) => {
          miniPlayer && e.preventDefault();
          dispatch(fetchWatchData("A9Bmny46rj2i", "/watch?v=A9Bmny46rj2i", {}));
        }}
      >
        <div className='press me'>press me</div>
      </Link>
      <Link
        to={"/watch?v=Od7PbjTYPJi"}
        onClick={(e) => {
          miniPlayer && e.preventDefault();
          dispatch(fetchWatchData("Od7PbjTYPJi", "/watch?v=Od7PbjTYPJi", {}));
        }}
      >
        <div className='press me'>press me</div>
      </Link>
    </div>
  );
}
