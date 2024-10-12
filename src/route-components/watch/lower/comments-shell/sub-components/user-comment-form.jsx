import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { EmojiIcon } from "../../../../../assets/icons";

export default function UserCommentForm() {
  const { pfp_url } = useSelector((state) => state.app.userData);
  const [hasContent, setHasContent] = useState(false);
  const interactablesRef = useRef();
  const inputRef = useRef();

  const handleChange = (e) => {
    const value = e.target.textContent;
    if (value.length > 0) {
      setHasContent(true);
    } else {
      setHasContent(false);
    }
  };

  const handleFocus = () => {
    interactablesRef.current.classList.add("show");
  };

  const undoChanges = () => {
    interactablesRef.current.classList.remove("show");
    inputRef.current.textContent = "";
    setHasContent(false);
  };

  return (
    <div className='user-comment-form'>
      <img src={pfp_url} alt='user-pfp' />
      <div className='form-right'>
        <div className='input-container'>
          <div className='form-input content-editable' ref={inputRef} contentEditable onInput={handleChange} onFocus={handleFocus}></div>
          <div className={`placeholder ${hasContent ? "hidden" : ""}`}>Add a comment... </div>
        </div>
        <div className='interactables' ref={interactablesRef}>
          <div className='interactable-left'>
            <EmojiIcon />
          </div>
          <div className='interactable-right'>
            <button type='button' className='ir cancel' onClick={undoChanges}>
              Cancel
            </button>
            <button type='button' className={`ir confirm ${hasContent ? "active" : ""}`}>
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
