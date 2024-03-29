import { useLayoutEffect } from "react";
import BrowseSecondaryVideos from "./browse-secondary-videos/browse-secondary-videos";
import FilterChipSecondary from "./filter-chip-secondary/filter-chip-secondary";
import "./secondary-content.css";
import { useSelector } from "react-redux";

export default function SecondaryContent({ secondaryRefInner, secondaryRefOuter }) {
  const windowWidth = useSelector((state) => state.app.windowWidth);
  const location = useSelector((state) => state.app.location);
  const fetchingRecommendations = useSelector((state) => state.watch.fetchingRecommendations);
  useLayoutEffect(() => {
    const secondaryInnerContent = document.querySelector(".secondary-inner");
    if (!secondaryInnerContent || !secondaryRefInner.current || !secondaryRefOuter.current) return;
    if (windowWidth <= 1040) {
      if (!Array.from(secondaryRefOuter.current.children).includes(secondaryInnerContent)) return;

      secondaryRefOuter.current.removeChild(secondaryInnerContent);
      secondaryRefInner.current.appendChild(secondaryInnerContent);
    } else {
      if (!Array.from(secondaryRefInner.current.children).includes(secondaryInnerContent)) return;
      secondaryRefInner.current.removeChild(secondaryInnerContent);
      secondaryRefOuter.current.appendChild(secondaryInnerContent);
    }
  }, [windowWidth, location]);
  return (
    <div className={`secondary-inner ${fetchingRecommendations ? "skeleton" : ""}`}>
      <FilterChipSecondary />
      <BrowseSecondaryVideos />
    </div>
  );
}
