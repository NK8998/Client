import CommentsSorting from "./sub-components/comments-sorting";
import "./comments.css";
import UserCommentForm from "./sub-components/user-comment-form";
import CommentsContainer from "./sub-components/comments";

export default function CommentsShell() {
  return (
    <div className='comments-shell'>
      <div className='top-row'>
        <CommentsSorting />
      </div>
      <UserCommentForm />
      <CommentsContainer />
    </div>
  );
}
