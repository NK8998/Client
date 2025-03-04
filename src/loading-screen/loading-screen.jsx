import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loadingscreen.css";
import { useDispatch } from "react-redux";
import AxiosFetching from "../utilities/axios-function";
import {
  updateCredentialsCheck,
  updateHasAccount,
  updateUserData,
} from "../store/Slices/app-slice";
import Loader from "../route-components/watch/player/utilities/loader";

export const LoadingScreen = () => {
  const [gettingLong, setGettingLong] = useState(false);
  const [tooLong, setToolong] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    verifyCredentials();

    setTimeout(() => {
      setGettingLong(true);
    }, 6000);
    setTimeout(() => {
      setToolong(true);
    }, 12000);
  }, []);

  const verifyCredentials = () => {
    AxiosFetching("get", `verify-credentials`, {}).then((response) => {
      if (response.data) {
        const userData = response.data.user_data[0]
          ? response.data.user_data[0]
          : {};
        //   dispatch(userLoggedIn(userData));

        dispatch(updateUserData(userData));
        dispatch(updateCredentialsCheck(true));
        if (response.data.user_data[0]) {
          dispatch(updateHasAccount(true));
        } else {
          dispatch(updateHasAccount(false));
        }
      }
    });
  };

  const handleReload = () => {
    window.location.reload();
  };
  return (
    <div className='loadingscreen'>
      <div className='masthead-skeleton'>
        <div className='end'>
          <div className='m-circle'></div>
          <div className='m-circle'></div>
          <div className='m-circle'></div>
        </div>
      </div>
      <div className='loading-text'>
        <h2>Please give it some time. It will be worth it I promise.</h2>
        {gettingLong && (
          <p className='loading-text-para'>
            This is a project I made to showcase my skills. It is a YouTube
            clone with a few features. It is largely inspired by YouTube's UI so
            there might be some similarities😂. Also, no Iframes were used in
            the making of this.
          </p>
        )}
        {tooLong && (
          <div className='taking-long-text'>
            <p>It appears to be taking forever. Try reloading👇.</p>
            <button onClick={handleReload} className='reload'>
              Reload
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
