import API from "./axiosInstance";

/*
=========================================================
GET PROJECT ACTIVITIES
=========================================================
*/

export const fetchProjectActivities =
  async (projectId) => {
    const res = await API.get(
      `/activity/project/${projectId}`,
    );

    return res.data.activities || [];
  };


/*
=========================================
GET TASK ACTIVITIES
=========================================
*/

export const fetchTaskActivities =
  async (taskId) => {
    const res = await API.get(
      `/activity/taskactivities/${taskId}`,
    );

    return (
      res.data.activities || []
    );
  };