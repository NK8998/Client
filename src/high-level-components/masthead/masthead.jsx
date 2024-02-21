import { useDispatch, useSelector } from "react-redux";
import { Burger } from "../../assets/icons";
import "./masthead.css";
import { handleNavResize } from "../../store/Slices/app-slice";

export default function MastHead() {
  const dispatch = useDispatch();
  const SignIn = () => {
    window.location.href = `http://localhost:5174?WAA=Client`;
  };
  return (
    <div className='masthead-outer'>
      <div className='masthead-inner'>
        <div className='start'>
          <div className='burger' onClick={() => dispatch(handleNavResize())}>
            <Burger />
          </div>
          <div className='logo'></div>
        </div>
        <div className='middle'></div>
        <div className='end'>
          <button type='button' onClick={SignIn}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
