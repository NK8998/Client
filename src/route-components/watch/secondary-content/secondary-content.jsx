import BrowseSecondaryVideos from "./browse-secondary-videos/browse-secondary-videos";
import FilterChipSecondary from "./filter-chip-secondary/filter-chip-secondary";
import "./secondary-content.css";

export default function SecondaryContent() {
  return (
    <div className='secondary-inner'>
      <FilterChipSecondary />
      <BrowseSecondaryVideos />
    </div>
  );
}
