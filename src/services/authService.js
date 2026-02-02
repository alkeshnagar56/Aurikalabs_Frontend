import API from "./axiosInstance";

// User-related API calls
//fetch user profile
export const fetchUserProfile = async () => API.get("/user/profile");

//user registration
export const registerUser = async (formData) => API.post("/user/signup", formData);

//user login
export const loginUser = async (formData)=> API.post("/user/login", formData);

//user logout
export const logoutUser = async () => API.post("/user/logout");

//update user profile
export const updateUserProfile = async (formData) => API.put("/user/update", formData);

