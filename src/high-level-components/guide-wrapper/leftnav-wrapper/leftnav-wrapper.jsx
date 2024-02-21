import { useDispatch, useSelector } from "react-redux";
import LeftNavContent from "./leftnav-wrapper-components/leftnav-content";
import LeftNavHeader from "./leftnav-wrapper-components/leftnav-header";
import { handleNavResize } from "../../../store/Slices/app-slice";
export default function LeftNavWrapper() {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.app.location);
  const isWatchPage = location.includes("watch");

  return (
    <>
      <div className={`leftnav-wrapper ${isWatchPage ? "hide" : "not-watch"}`}>
        <LeftNavHeader />
        <LeftNavContent />
      </div>
      <div className='dark-bg-closer' onClick={() => dispatch(handleNavResize())}></div>
    </>
  );
}
