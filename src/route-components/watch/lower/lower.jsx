import { useSelector } from "react-redux";
import "./lower.css";
import LowerInteractions from "./lower-interactions/lower-interactions";
import Description from "./description/description";
import InteractablePanel from "./interactable-panel/interactable-panel";
import CommentsShell from "./comments-shell/comments-shell";

export default function Lower() {
  const { title } = useSelector((state) => state.watch.playingVideo);
  return (
    <div className='lower'>
      <InteractablePanel />
      <p className='video-title'>{title}</p>
      <LowerInteractions />
      <Description />
      <CommentsShell />
    </div>
  );
}
