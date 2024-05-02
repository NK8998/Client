import SubInteractions from "./sub-interactions";
import UploderDetails from "./uploader-details";

export default function LowerInteractions() {
  return (
    <div className='lower-interactions'>
      <div className='lower-interctions-left'>
        <UploderDetails />
        <SubInteractions />
      </div>
      <div className='lower-interactions-right'></div>
    </div>
  );
}
