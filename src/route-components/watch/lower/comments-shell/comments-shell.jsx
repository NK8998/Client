import CommentsSorting from "./sub-components/comments-sorting";
import "./comments.css";
import UserCommentForm from "./sub-components/user-comment-form";

export default function CommentsShell() {
  return (
    <div className='comments-shell'>
      <div className='top-row'>
        <CommentsSorting />
      </div>
      <UserCommentForm />
    </div>
  );
}
