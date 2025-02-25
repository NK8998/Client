import { useDispatch, useSelector } from "react-redux";
import LeftNavContent from "./leftnav-wrapper-components/leftnav-content";
import LeftNavHeader from "./leftnav-wrapper-components/leftnav-header";
import { handleNavResize } from "../../../store/Slices/app-slice";
import { useEffect, useRef } from "react";
export default function LeftNavWrapper() {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.app.location);
  const prefersMini = useSelector((state) => state.app.prefersMini);
  const isWatchPage = location.includes("watch");
  const leftNavRef = useRef();

  // const addRemoveWatchPageStyle = () => {
  //   if (isWatchPage) {
  //     leftNavRef.current.classList.add("hide");
  //     leftNavRef.current.classList.remove("not-watch");
  //   } else {
  //     leftNavRef.current.classList.remove("hide");
  //     leftNavRef.current.classList.add("not-watch");
  //   }
  // };
  // useEffect(() => {
  //   addRemoveWatchPageStyle();
  //   window.addEventListener("resize", addRemoveWatchPageStyle);

  //   return () => {
  //     window.removeEventListener("resize", addRemoveWatchPageStyle);
  //   };
  // }, [location]);

  return (
    <>
      <div ref={leftNavRef} className={`leftnav-wrapper ${isWatchPage ? "hide" : "not-watch"} ${prefersMini ? "hide-home" : ""}`}>
        <LeftNavHeader />
        <LeftNavContent />
      </div>
      <div className='dark-bg-closer' onClick={() => dispatch(handleNavResize())}></div>
    </>
  );
}
