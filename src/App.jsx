import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import MastHead from "./high-level-components/masthead/masthead";
import Watch from "./route-components/watch/watch";
import Home from "./route-components/home/home";
import { Route, Routes } from "react-router-dom";
import BareHome from "./bare-routes/bare-home";
import BareWatch from "./bare-routes/bare-watch";
import { useDispatch } from "react-redux";
import { handleNavigation, updateLocation, updateRefs, updateWindowWidth } from "./store/Slices/app-slice";
import GuideWrapper from "./high-level-components/guide-wrapper/guide-wrapper";

function App() {
  const dispatch = useDispatch();
  const homeRef = useRef();
  const watchRef = useRef();
  // all refs should be here to enure they are all called when app loads

  useLayoutEffect(() => {
    const refArray = [
      { route: "/", ref: homeRef.current.id },
      { route: "/watch", ref: watchRef.current.id },
    ];

    dispatch(updateRefs(refArray));

    const currentRoute = window.location.pathname.split("?")[0];
    // console.log(currentRoute);
    dispatch(handleNavigation(currentRoute));

    window.addEventListener("popstate", () => {
      const currentRoute = window.location.pathname.split("?")[0];
      // check if data is being fetched before navigating
      dispatch(updateLocation(currentRoute));
      dispatch(handleNavigation(currentRoute));
    });

    window.addEventListener("resize", () => {
      const windowWidth = window.innerWidth;
      const leftNavMain = document.querySelector(".leftnav-wrapper");

      if (windowWidth >= 1024) {
        leftNavMain.classList.remove("show-not-watch");
      } else if (windowWidth < 1024) {
        leftNavMain.classList.toggle("hide");
      }
      dispatch(updateWindowWidth(windowWidth));
    });
  }, []);

  return (
    <>
      <MastHead />
      <div className='flex-content'>
        <GuideWrapper />
        <div className='page-manager'>
          <Home homeRef={homeRef} />
          <Watch watchRef={watchRef} />
        </div>
      </div>
      <Routes>
        <Route path='/' element={<BareHome />} />
        <Route path='/watch' element={<BareWatch />} />
      </Routes>
    </>
  );
}

export default App;
