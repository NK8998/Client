import { useDispatch, useSelector } from "react-redux";
import {
  Burger,
  DefaultUserIcon,
  YTLogo,
  NotificationIcon,
  CreateIcon,
} from "../../assets/icons";
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
    if (import.meta.env.PROD) {
      // Production logic
      window.location.href = `${
        import.meta.env.VITE_DEPLOYED_OAUTH_URL
      }?redirect=${window.location.href}`;
    } else {
      window.location.href = `${
        import.meta.env.VITE_LOCAL_OAUTH_URL
      }?redirect=${window.location.href}`;
    }
  };

  const handleStudioRedirect = () => {
    if (import.meta.env.PROD) {
      // Production logic
      window.location.href = `${import.meta.env.VITE_DEPLOYED_STUDIO_URL}`;
    } else {
      window.location.href = `${import.meta.env.VITE_LOCAL_STUDIO_URL}`;
    }
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
            <button className='sign-in-btn' type='button' onClick={SignIn}>
              <DefaultUserIcon />
              Sign in
            </button>
          ) : (
            <>
              <div className='mast-icon' onClick={handleStudioRedirect}>
                <CreateIcon />
              </div>
              <div className='mast-icon'>
                <NotificationIcon />
              </div>
              <img src={pfp_url} alt='pfp' className='user-pfp' />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
