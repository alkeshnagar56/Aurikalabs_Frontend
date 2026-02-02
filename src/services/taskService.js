import API from "./axiosInstance";

// Task-related API calls
//create task
export const createTask = async (formData) => {
  const res = await API.post("/task/createtask", formData);
  return res.data.task || [];
};

//get all tasks for a project
export const fetchTasks = async (projectId) => {
  const res = await API.get(`/task/gettasks/${projectId}`);
  return res.data.tasks || [];
};

//get single task by id
export const fetchTaskById = async (taskId) => {
  const res = await API.get(`/task/gettask/${taskId}`);
  return res.data.task || [];
};

//update task by id
export const updateTask = async (taskId, formData) => {
  const res = await API.put(`/task/updatetask/${taskId}`, formData);
  return res.data.task || [];
};

//delete task by id
export const deleteTask = async (taskId) =>
  await API.delete(`/task/deletetask/${taskId}`);

// get all assigned tasks
export const assignedtasks = async () => {
  const res = await API.get("/task/assignedtasks");
  return res.data.tasks;
};
