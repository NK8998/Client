import { useSelector } from "react-redux";
import SecondaryVideoComponent from "./secondary-videos-component";

export default function BrowseSecondaryVideos() {
  const recommendations = useSelector((state) => state.watch.recommendations);

  const elements = recommendations.map((video) => {
    return <SecondaryVideoComponent data={video} key={video.video_id} />;
  });
  return <div className='secondary-content-inner'>{elements}</div>;
}
