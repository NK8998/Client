import "./bottom-controls.css";
import { BottomControlsLeft } from "./bc-components/bottom-controls-left";
import { BottomControlsRight } from "./bc-components/bottom-controls-right";

export default function BottomControls({ handlePlayState, miniPlayerBoolean, playerRef }) {
  return (
    <div className='bottom-controls'>
      <BottomControlsLeft handlePlayState={handlePlayState} />
      <BottomControlsRight miniPlayerBoolean={miniPlayerBoolean} playerRef={playerRef} />
    </div>
  );
}
