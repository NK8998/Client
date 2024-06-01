import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./channel.css";
import Featured from "./channel-routes/featured/featured";
import Videos from "./channel-routes/videos/videos";
import Shorts from "./channel-routes/shorts/shorts";
import Playlists from "./channel-routes/playlists/playlists";
import Live from "./channel-routes/live/live";
import Community from "./channel-routes/community/community";
import { fetchTabContent } from "../../store/Slices/channel-slice";

export default function Channel({ channelRef }) {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.app.location);
  const navigate = useNavigate();
  const currentChannel = useSelector((state) => state.channel.currentChannel);
  const timeoutRef = useRef();

  if (!location || !currentChannel) {
    return <div className='channel-content' ref={channelRef} id='channel' hidden={true}></div>;
  }

  const tabComponentObjects = [
    { route: "", component: <Featured key={"featured"} /> },
    { route: "/featured", component: <Featured key={"featured"} /> },
    { route: "/videos", component: <Videos key={"videos"} /> },
    { route: "/shorts", component: <Shorts key={"shorts"} /> },
    { route: "/playlists", component: <Playlists key={"playlists"} /> },
    { route: "/live", component: <Live key={"live"} /> },
    { route: "/community", component: <Community key={"community"} /> },
  ];
  const currentRoute = location.split(`/${currentChannel}`)[1] || "";

  let currentTabComponent;
  currentTabComponent = tabComponentObjects.find((tabComponent) => tabComponent.route === currentRoute);

  if (!currentTabComponent) {
    currentTabComponent = tabComponentObjects[0];
  }

  const handleNavigation = (targetRoute) => {
    navigate(targetRoute);
  };

  return (
    <div className='channel-content' ref={channelRef} id='channel' hidden={true}>
      <div className='route-buttons'>
        <button onClick={() => handleNavigation(`/${currentChannel}/featured`)}>home</button>
        <button onClick={() => handleNavigation(`/${currentChannel}/videos`)}>videos</button>
        <button onClick={() => handleNavigation(`/${currentChannel}/shorts`)}>shorts</button>
        <button onClick={() => handleNavigation(`/${currentChannel}/playlists`)}>playlists</button>
        <button onClick={() => handleNavigation(`/${currentChannel}/community`)}>community</button>
        <button onClick={() => handleNavigation(`/${currentChannel}/live`)}>live</button>
      </div>
      {currentTabComponent.component}
    </div>
  );
}
