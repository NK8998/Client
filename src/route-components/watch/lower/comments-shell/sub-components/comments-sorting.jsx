import { SortIcon } from "../../../../../assets/icons";

export default function CommentsSorting() {
  return (
    <div className='comments-sorter'>
      <h1>149 Comments</h1>

      <div className='sort-by'>
        <SortIcon />
        <p>Sort by</p>
      </div>
    </div>
  );
}
