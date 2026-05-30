import API from "./axiosInstance";

/*
=========================================
CREATE COMMENT
=========================================
*/

export const createComment = async (
  taskId,
  formData,
) => {
  const res = await API.post(
    `/comment/createcomment/${taskId}`,
    formData,
  );

  return res.data.comment;
};

/*
=========================================
GET COMMENTS
=========================================
*/

export const fetchComments = async (
  taskId,
) => {
  const res = await API.get(
    `/comment/getcomments/${taskId}`,
  );

  return res.data.comments || [];
};

/*
=========================================
DELETE COMMENT
=========================================
*/

export const deleteComment = async (
  commentId,
) => {
  return await API.delete(
    `/comment/deletecomment/${commentId}`,
  );
};