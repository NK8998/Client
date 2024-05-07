import { useLayoutEffect } from "react";
import BrowseSecondaryVideos from "./browse-secondary-videos/browse-secondary-videos";
import FilterChipSecondary from "./filter-chip-secondary/filter-chip-secondary";
import "./secondary-content.css";
import { useSelector } from "react-redux";

export default function SecondaryContent({ secondaryRefInner, secondaryRefOuter }) {
  const location = useSelector((state) => state.app.location);
  const windowWidth = useSelector((state) => state.app.windowWidth);
  const fetchingRecommendations = useSelector((state) => state.watch.fetchingRecommendations);

  useLayoutEffect(() => {
    const handleResizing = () => {
      const windowWidth = window.innerWidth;
      const secondaryOuter = document.querySelector(".secondary");
      const secondaryInnerContent = document.querySelector(".secondary-inner");
      if (!secondaryInnerContent || !secondaryRefInner.current || !secondaryRefOuter.current) return;
      if (windowWidth <= 1040) {
        secondaryOuter.style.width = "0px";
        secondaryOuter.style.minWidth = "0px";
        if (!Array.from(secondaryRefOuter.current.children).includes(secondaryInnerContent)) return;

        secondaryRefOuter.current.removeChild(secondaryInnerContent);
        secondaryRefInner.current.appendChild(secondaryInnerContent);
      } else {
        secondaryOuter.style.width = "400px";
        secondaryOuter.style.minWidth = "400px";
        if (!Array.from(secondaryRefInner.current.children).includes(secondaryInnerContent)) return;
        secondaryRefInner.current.removeChild(secondaryInnerContent);
        secondaryRefOuter.current.appendChild(secondaryInnerContent);
      }
    };

    handleResizing();

    // window.addEventListener("resize", handleResizing);

    // return () => {
    //   window.removeEventListener("resize", handleResizing);
    // };
  }, [location, windowWidth]);
  return (
    <div className={`secondary-inner ${fetchingRecommendations ? "skeleton" : ""}`}>
      <FilterChipSecondary />
      <BrowseSecondaryVideos />
    </div>
  );
}
