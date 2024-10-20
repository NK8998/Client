export default function CommentsContainer() {
  const comments = [];

  comments.map((comment) => {
    return <Comment />;
  });
  return <div className=''></div>;
}

export const Comment = ({}) => {
  return <div className='comment-container'></div>;
};
