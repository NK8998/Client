import { useSelector } from "react-redux";

import "./guide-wrapper.css";
import LeftNavWrapper from "./leftnav-wrapper/leftnav-wrapper";
import MiniLeftNav from "./leftnav-wrapper/leftnav-wrapper-components/mini-leftnav";
export default function GuideWrapper() {
  const location = useSelector((state) => state.app.location);

  const isWatchPage = location.includes("watch");

  return location.length === 0 ? (
    <div className='guid-wrapper'></div>
  ) : (
    <div className={`guide-wrapper`}>
      <LeftNavWrapper />

      {!isWatchPage && <MiniLeftNav />}
    </div>
  );
}
