import { useDispatch, useSelector } from "react-redux";
import { updateWatchState } from "../../../../../../store/Slices/watch-slice";
import { ArrowRightBottomControls } from "../../../../../../assets/icons";

export default function BottomControlsMiddle() {
  const chapters = useSelector((state) => state.player.chapters);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(updateWatchState({ watchPropertyToUpdate: "chaptersListShowing", updatedValue: true }));
  };
  return (
    <button className={`player-button chapter-title ${chapters.length <= 1 ? "single" : ""}`} onClick={handleClick}>
      <div className='floating-dot'></div>
      <p className='chapter-title-container bottom'></p>
      <ArrowRightBottomControls />
    </button>
  );
}
