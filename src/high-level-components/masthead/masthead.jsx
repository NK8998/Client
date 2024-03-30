import { useDispatch, useSelector } from "react-redux";
import { Burger, YTLogo } from "../../assets/icons";
import "./masthead.css";
import { handleNavResize } from "../../store/Slices/app-slice";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function MastHead() {
  const hasAccount = useSelector((state) => state.app.hasAccount);
  const userData = useSelector((state) => state.app.userData);
  const { pfp_url } = userData;
  console.log({ userData }, { hasAccount });
  const dispatch = useDispatch();
  const mastheadRef = useRef();
  const SignIn = () => {
    window.location.href = `http://localhost:5174?WAA=Client`;
  };

  return (
    <div className='masthead-outer' ref={mastheadRef}>
      <div className='masthead-inner'>
        <div className='start'>
          <div className='burger' onClick={() => dispatch(handleNavResize())}>
            <Burger />
          </div>
          <Link to={"/"}>
            <div className='logo'>
              <YTLogo />
            </div>
          </Link>
        </div>
        <div className='middle'></div>
        <div className='end'>
          {!hasAccount ? (
            <button type='button' onClick={SignIn}>
              Sign in
            </button>
          ) : (
            <img src={pfp_url} alt='pfp' className='user-pfp' />
          )}
        </div>
      </div>
    </div>
  );
}
