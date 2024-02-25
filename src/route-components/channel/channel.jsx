import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./channel.css";
import Featured from "./channel-routes/featured/featured";
import Videos from "./channel-routes/videos/videos";
import Shorts from "./channel-routes/shorts/shorts";
import Playlists from "./channel-routes/playlists/playlists";
import Live from "./channel-routes/live/live";
import Community from "./channel-routes/community/community";

export default function Channel({ channelRef }) {
  const location = useSelector((state) => state.app.location);
  const currentChannel = useSelector((state) => state.channel.currentChannel);

  if (!location || !currentChannel) {
    return <div className='channel-content hidden' ref={channelRef} id='channel'></div>;
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

  const handleNavigation = (targetRoute) => {};

  return (
    <div className='channel-content hidden' ref={channelRef} id='channel'>
      <div className='route-buttons'>
        <Link to={`/${currentChannel}/featured`}>home</Link>
        <Link to={`/${currentChannel}/videos`}>videos</Link>
        <Link to={`/${currentChannel}/shorts`}>shorts</Link>
        <Link to={`/${currentChannel}/playlists`}>playlists</Link>
        <Link to={`/${currentChannel}/community`}>community</Link>
        <Link to={`/${currentChannel}/live`}>live</Link>
      </div>
      {currentTabComponent.component}
    </div>
  );
}
