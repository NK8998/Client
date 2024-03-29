import { useDispatch, useSelector } from "react-redux";
import { useAppNavigation } from "../../../../utilities/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import VideoComponent from "../../../../utilities/video-component";
import { Link } from "react-router-dom";
import { updateMaxNums } from "../../../../store/Slices/home-slice";

export default function BrowseVideos() {
  const recommendedVideos = useSelector((state) => state.home.recommendedVideos);
  const location = useSelector((state) => state.app.location);
  const windowWidth = useSelector((state) => state.app.windowWidth);
  const gridContainerRef = useRef();
  const dispatch = useDispatch();
  const maxNumVideo = useSelector((state) => state.home.maxNumVideo);
  const maxNumShort = useSelector((state) => state.home.maxNumShort);

  useLayoutEffect(() => {
    dispatch(updateMaxNums());
  }, [windowWidth, location]);

  const videoDrawers = [];
  let currentDrawer = [];

  //   const shortDrawers = [];
  //   let currentShortDrawer = [];

  recommendedVideos.forEach((video, index) => {
    currentDrawer.push(video);

    // If the maximum number of videos per drawer is reached or it's the last video in the list
    if (currentDrawer.length === maxNumVideo || index === recommendedVideos.length - 1) {
      videoDrawers.push(currentDrawer);
      currentDrawer = [];
    }
  });

  //   shortVideos.map((video, index) => {
  //     currentShortDrawer.push(video);
  //     if (currentShortDrawer.length === max_num_short || index === shortVideos.length - 1) {
  //       shortDrawers.push(currentShortDrawer);
  //       currentShortDrawer = [];
  //     }
  //   });
  const elements = videoDrawers.map((drawer, index) => {
    return (
      <div className={`grid ${index === videoDrawers.length - 1 ? "last" : ""}`} key={index}>
        {drawer.map((video, index) => {
          return <VideoComponent data={video} key={`${index}-${video.title}`} />;
        })}
      </div>
    );
  });

  return (
    <div className='grid-container' ref={gridContainerRef}>
      {elements}
    </div>
  );
}
