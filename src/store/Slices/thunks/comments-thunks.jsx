import AxiosFetching from "../../../utilities/axios-function";

export const fetchComments = () => {
  return (dispatch, getState) => {
    const { video_id } = getState.watch.playingVideo;
    const formData = new FormData();
    formData.append("video_id", video_id);

    AxiosFetching("post", "get-comments", formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };
};

export const postComment = (formData) => {
  return (dispatch, getState) => {
    AxiosFetching("post", "post-comment", formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };
};
