import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EmojiIcon } from "../../../../../assets/icons";
import { nanoid } from "@reduxjs/toolkit";
import { postComment } from "../../../../../store/Slices/thunks/comments-thunks";

export default function UserCommentForm() {
  const { pfp_url, user_id } = useSelector((state) => state.app.userData);
  const { video_id } = useSelector((state) => state.watch.playingVideo);
  const [hasContent, setHasContent] = useState(false);
  const interactablesRef = useRef();
  const placeholderRef = useRef();
  const inputRef = useRef();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const value = e.target.textContent;
    if (value.trim().length > 0) {
      setHasContent(true);
    } else {
      setHasContent(false);
    }
    if (value.length > 0) {
      placeholderRef.current.classList.add("hidden");
    } else {
      placeholderRef.current.classList.remove("hidden");
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

  const handleSubmit = () => {
    const comment_id = nanoid(10);
    const body = inputRef.current.textContent.trim();

    if (body.length === 0) return;

    const formData = new FormData();
    formData.append("comment_id", comment_id);
    formData.append("parent_id", null);
    formData.append("user_id", user_id);
    formData.append("video_id", video_id);
    formData.append("body", body);

    dispatch(postComment(formData));
  };

  return (
    <div className='user-comment-form'>
      <img src={pfp_url} alt='user-pfp' />
      <div className='form-right'>
        <div className='input-container'>
          <div className='form-input content-editable' ref={inputRef} contentEditable onInput={handleChange} onFocus={handleFocus}></div>
          <div className={`placeholder`} ref={placeholderRef}>
            Add a comment...
          </div>
        </div>
        <div className='interactables' ref={interactablesRef}>
          <div className='interactable-left'>
            <EmojiIcon />
          </div>
          <div className='interactable-right'>
            <button type='button' className='ir cancel' onClick={undoChanges}>
              Cancel
            </button>
            <button type='button' className={`ir confirm ${hasContent ? "active" : ""}`} onClick={handleSubmit}>
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
