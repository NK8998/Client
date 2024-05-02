import { useSelector } from "react-redux";
import "./lower.css";
import LowerInteractions from "./lower-interactions/lower-interactions";
import Description from "./description/description";

export default function Lower() {
  const { title } = useSelector((state) => state.watch.playingVideo);
  return (
    <div className='lower'>
      <p className='video-title'>{title}</p>
      <LowerInteractions />
      <Description />
    </div>
  );
}
