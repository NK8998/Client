import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./loadingscreen.css";
import { useDispatch } from "react-redux";
import AxiosFetching from "../utilities/axios-function";
import { updateCredentialsCheck, updateHasAccount, updateUserData } from "../store/Slices/app-slice";

export const LoadingScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    verifyCredentials();
  }, []);

  const verifyCredentials = () => {
    AxiosFetching("get", `verify-credentials`, {}).then((response) => {
      if (response.data) {
        const userData = response.data.user_data[0] ? response.data.user_data[0] : {};
        //   dispatch(userLoggedIn(userData));

        dispatch(updateUserData(userData));
        dispatch(updateCredentialsCheck(true));
        if (response.data.user_data[0]) {
          dispatch(updateHasAccount(true));
        } else {
          dispatch(updateHasAccount(false));
        }
        // localStorage.setItem("SCID", JSON.stringify(userData.channel_id));
        // localStorage.setItem("SUID", JSON.stringify(userData.user_id));
      }
    });
  };

  return (
    <div className='loadingscreen'>
      <p>loading spinner....</p>
    </div>
  );
};
