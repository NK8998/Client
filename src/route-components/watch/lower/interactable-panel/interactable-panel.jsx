import { useSelector } from "react-redux";
import ChaptersList from "../../secondary-content/chapters-list/chapters-list";

export default function InteractablePanel() {
  const windowWidth = useSelector((state) => state.app.windowWidth);

  return (
    <div className='interactable-panel'>
      {windowWidth <= 1040 && (
        <>
          <ChaptersList />
        </>
      )}
    </div>
  );
}
