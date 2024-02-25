import { Outlet } from "react-router-dom";

export default function BareChannel() {
  return (
    <div className='bare-hidden-channel'>
      <Outlet />
    </div>
  );
}
