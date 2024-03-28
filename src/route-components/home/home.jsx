import BrowseVideos from "./home-components/browse-videos/browse-videos";
import FilterChipBar from "./home-components/filter-chip-bar/filter-chip-bar";
import "./home.css";

export default function Home({ homeRef }) {
  return (
    <div className='home hidden' ref={homeRef} id='home'>
      <FilterChipBar />
      <BrowseVideos />
    </div>
  );
}
