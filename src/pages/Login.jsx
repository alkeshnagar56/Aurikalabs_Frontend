import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchUserProfile, loginUser } from "../services/authService";
import { showError, showSuccess } from "../utils/toastStyles";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const {user, setUser, setLoading } = useContext(AuthContext);

  const Profile = async () => {
    try {
      const res = await fetchUserProfile();
      setUser(res.data);
    } catch (err) {
      console.error("User is not valid or token not found", err.response?.data);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(formData);

      setMessage(res.data.message || "Login successful");
      showSuccess("Login successful")

      Profile();
      if(user){
      navigate("/dashboard");
      } else{
        navigate("/signup");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
      showError(error.response?.data?.message || "Failed to Login, Please try again..");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-red-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
