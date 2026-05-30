// src/pages/Login.jsx

import React, { useContext, useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";

import {
  fetchUserProfile,
  loginUser,
} from "../services/authService";

import {
  showError,
  showSuccess,
} from "../utils/toastStyles";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const { user, setUser, setLoading } =
    useContext(AuthContext);

  const Profile = async () => {
    try {
      const res = await fetchUserProfile();

      setUser(res.data);
    } catch (err) {
      console.error(
        "User is not valid or token not found",
        err.response?.data,
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(formData);

      setMessage(res.data.message || "Login successful");

      showSuccess("Login successful");

      await Profile();

      navigate("/dashboard");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Login failed",
      );

      showError(
        err.response?.data?.message ||
          "Failed to Login, Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070710] px-4 py-10 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute w-[300px] h-[300px] bg-purple-600/20 blur-[120px] top-[-100px] left-[-100px]" />

      <div className="absolute w-[260px] h-[260px] bg-pink-500/20 blur-[120px] bottom-[-100px] right-[-100px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b17]/95 backdrop-blur-2xl shadow-2xl">
        
        {/* Inner Glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full" />

        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-pink-500/10 blur-3xl rounded-full" />

        <div className="relative z-10 p-6 md:p-7">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />

            Welcome Back
          </div>

          {/* Heading */}
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-2">
            Sign in to{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
              Aurika Labs
            </span>
          </h1>

          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Continue managing projects, tasks, and
            real-time collaboration with your team.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Email Address
              </label>

              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl px-3 py-2.5 focus-within:border-purple-500/40 focus-within:bg-white/[0.05] transition-all duration-300">
                <Mail className="w-4 h-4 text-gray-500" />

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Password
              </label>

              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl px-3 py-2.5 focus-within:border-pink-500/40 focus-within:bg-white/[0.05] transition-all duration-300">
                <Lock className="w-4 h-4 text-gray-500" />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/20 hover:scale-[1.02] hover:shadow-purple-500/40 transition-all duration-300"
            >
              Login

              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-5 text-center">
            <p className="text-xs text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-300 hover:text-pink-300 transition"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Message */}
          {message && (
            <p className="mt-4 text-center text-xs text-red-400 font-medium">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;