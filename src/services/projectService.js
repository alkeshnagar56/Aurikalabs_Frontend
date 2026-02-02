import API from "./axiosInstance";

// Project-related API calls
//create project
export const createProject = async (formData) => {
  const res = await API.post("/project/createproject", formData);
  return res.data;
};

// get all projects for a user
export const fetchProjects = async () => {
  const res = await API.get("/project/getprojects");
  return res.data.projects || []; // axios auto-parses JSON
};

//get single project by id
export const fetchProjectById = async (projectId) => {
  const res = await API.get(`/project/getproject/${projectId}`);
  return res.data.project;
};

//update project by id
export const updateProject = async (projectId, formData) =>
  API.put(`/project/updateproject/${projectId}`, formData);

//delete project by id
export const deleteProject = async (projectId) =>
  API.delete(`/project/deleteproject/${projectId}`);

//add member to project by email
export const addMemberToProject = async (projectId, email) => {
  const res = await API.post(`/project/${projectId}/addmember`, { email });
  return res.data; // contains { message, project }
};

// remove member from project by email
export const removeMemberFromProject = async (projectId, email) => {
  const res = await API.post(`/project/${projectId}/removemember`, { email });
  return res.data; // contains { message, project }
};

// get all members of the project
export const getMembers = async (projectId) => {
  const res = await API.get(`/project/getproject/${projectId}`);
  return res.data.project.members;
};

//get all the projects in which user is a member not a creator
export const getAssociatedProjects = async () => {
  const res = await API.get("/project/associatedprojects");
  return res.data.projects;
};
