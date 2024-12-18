import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import MastHead from "./high-level-components/masthead/masthead";
import Watch from "./route-components/watch/watch";
import Home from "./route-components/home/home";
import { Route, Routes } from "react-router-dom";
import BareHome from "./bare-routes/bare-home";
import BareWatch from "./bare-routes/bare-watch";
import { useDispatch, useSelector } from "react-redux";
import {
  handleFullscreenChange,
  handlePopState,
  handleResize,
  updateRefs,
} from "./store/Slices/app-slice";
import GuideWrapper from "./high-level-components/guide-wrapper/guide-wrapper";
import Channel from "./route-components/channel/channel";
import BareChannel from "./bare-routes/bare-channel/bare-channel";
import BareFeatured from "./bare-routes/bare-channel/bare-channel-routes/bare-featured/bare-featured";
import BareVideos from "./bare-routes/bare-channel/bare-channel-routes/bare-videos/bare-videos";
import BareShorts from "./bare-routes/bare-channel/bare-channel-routes/bare-shorts/bare-shorts";
import BareLive from "./bare-routes/bare-channel/bare-channel-routes/bare-live/bare-live";
import BarePlaylists from "./bare-routes/bare-channel/bare-channel-routes/bare-playlists/bare-playlists";
import BareCommunity from "./bare-routes/bare-channel/bare-channel-routes/bare-community/bare-community";
import MiniPlayer from "./route-components/watch/player/mini-player";
import { LoadingScreen } from "./loading-screen/loading-screen";
import { debounce } from "lodash";
import { Toaster } from "sonner";

function App() {
  const credentialsChecked = useSelector((state) => state.app.credentialsChecked);
  const debounceTime = useSelector((state) => state.app.debounceTime);
  const dispatch = useDispatch();
  const homeRef = useRef();
  const watchRef = useRef();
  const channelRef = useRef();
  const miniplayerRef = useRef();
  const miniPlayerBoolean = useRef(false);
  // all refs should be here to enure they are all called when app loads

  useLayoutEffect(() => {
    if (!credentialsChecked) return;
    const refArray = [
      { route: "/", ref: homeRef.current.id },
      { route: "/watch", ref: watchRef.current.id },
      { route: "/:channel", ref: channelRef.current.id },
    ];

    dispatch(updateRefs(refArray));

    document.addEventListener("fullscreenchange", (e) => {
      dispatch(handleFullscreenChange());
    });

    window.addEventListener("popstate", () => {
      dispatch(handlePopState());
    });

    const handleResizing = () => {
      dispatch(handleResize());
    };

    handleResizing();

    const debouncedVar = debounce(handleResizing, debounceTime);

    window.addEventListener("resize", debouncedVar);

    return () => {
      window.removeEventListener("resize", debouncedVar);
    };
  }, [credentialsChecked]);

  return credentialsChecked ? (
    <div className='app'>
      <Toaster position='bottom-left' richColors />
      <MastHead />
      <div className='flex-content'>
        <GuideWrapper />
        <div className='page-manager'>
          <Home homeRef={homeRef} />
          <Watch
            watchRef={watchRef}
            miniplayerRef={miniplayerRef}
            miniPlayerBoolean={miniPlayerBoolean}
          />
          <Channel channelRef={channelRef} />
        </div>
      </div>
      <MiniPlayer miniplayerRef={miniplayerRef} />
      <Routes>
        <Route path='/' element={<BareHome />} />
        <Route path='/watch' element={<BareWatch miniPlayerBoolean={miniPlayerBoolean} />} />
        <Route path='/:channel/*' element={<BareChannel />}>
          <Route path='' element={<BareFeatured />} />
          <Route path='featured' element={<BareFeatured />} />
          <Route path='videos' element={<BareVideos />} />
          <Route path='shorts' element={<BareShorts />} />
          <Route path='live' element={<BareLive />} />
          <Route path='playlists' element={<BarePlaylists />} />
          <Route path='community' element={<BareCommunity />} />
          <Route path='*' element={<BareFeatured />} />
        </Route>
      </Routes>
    </div>
  ) : (
    <LoadingScreen />
  );
}

export default App;
