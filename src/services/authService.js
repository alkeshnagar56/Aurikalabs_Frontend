import API from "./axiosInstance";

// User-related API calls
//fetch user profile
export const fetchUserProfile = async () => API.get("/user/profile");

//user registration
export const registerUser = async (formData) => API.post("/user/signup", formData);

//user login
export const loginUser = async (formData) => API.post("/user/login", formData);

// google login
export const googleLogin = async (credential) => API.post("/user/google-login", { credential, });

//user logout
export const logoutUser = async () => API.post("/user/logout");

//update user profile
export const updateUserProfile = async (formData) => API.put("/user/update", formData);

export const verifyEmail = async (data) => API.post("/user/verify-email", data);

export const sendOtp = async (data) =>
  API.post("/user/send-otp", data);

export const verifyOtp = async (data) =>
  API.post("/user/verify-otp", data);

export const resetPassword = async (data) =>
  API.post("/user/reset-password", data);