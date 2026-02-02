// api calls for messages

import API from "./axiosInstance";

export const getMessages = async (conversationType, conversationId) => {
  const res = await API.get(`/chat/${conversationType}/${conversationId}`);
  return res.data.messages || [];
};
