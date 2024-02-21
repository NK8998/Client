import { useDispatch, useSelector } from "react-redux";
import { Burger } from "../../../../assets/icons";
import { handleNavResize } from "../../../../store/Slices/app-slice";

export default function LeftNavHeader() {
  const dispatch = useDispatch();

  return (
    <div className='leftnav-header'>
      <div className='burger' onClick={() => dispatch(handleNavResize())}>
        <Burger />
      </div>
      <div className='logo'></div>
    </div>
  );
}
