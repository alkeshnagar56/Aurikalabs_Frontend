// src/pages/Signup.jsx

import React, { useContext, useEffect, useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import { User, Mail, Lock, UserPlus, Sparkles } from "lucide-react";

import { AuthContext } from "../context/AuthContext";

import { registerUser, verifyEmail } from "../services/authService";

import { showError, showSuccess } from "../utils/toastStyles";

const Signup = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [showOtpScreen, setShowOtpScreen] = useState(false);

  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 8) {
      showError("Password must be at least 8 characters long");

      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError("Passwords do not match");

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      return;
    }

    try {
      const res = await registerUser(formData);

      setMessage(res.data.message || "Signup successful");

      showSuccess("OTP sent to your email");

      setShowOtpScreen(true);
    } catch (err) {
      if (err.response?.data?.message === "User already exists") {
        navigate("/login");
      }

      showError(err.response?.data?.message || "Signup failed");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      await verifyEmail({
        email: formData.email,
        otp,
      });

      showSuccess("Email verified successfully");

      navigate("/login");
    } catch (err) {
      showError(err.response?.data?.message || "OTP verification failed");
    }
  };

  if (showOtpScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070710] px-4 py-10 relative overflow-hidden">
        <div className="absolute w-[300px] h-[300px] bg-purple-600/20 blur-[120px] top-[-100px] left-[-100px]" />

        <div className="absolute w-[260px] h-[260px] bg-pink-500/20 blur-[120px] bottom-[-100px] right-[-100px]" />

        <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b17]/95 backdrop-blur-2xl shadow-2xl">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full" />

          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-pink-500/10 blur-3xl rounded-full" />

          <div className="relative z-10 p-6 md:p-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Email Verification
            </div>

            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-2 text-white">
              Verify your email
            </h1>

            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              We sent a verification code to
              <br />
              <span className="text-purple-300">{formData.email}</span>
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Enter OTP
                </label>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="6-digit OTP"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/40"
                />
              </div>

              <button
                type="submit"
                className="group w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300"
              >
                Verify Email
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070710] px-4 py-10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[300px] h-[300px] bg-purple-600/20 blur-[120px] top-[-100px] left-[-100px]" />

      <div className="absolute w-[260px] h-[260px] bg-pink-500/20 blur-[120px] bottom-[-100px] right-[-100px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b17]/95 backdrop-blur-2xl shadow-2xl">
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full" />

        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-pink-500/10 blur-3xl rounded-full" />

        <div className="relative z-10 p-6 md:p-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Join Aurika Labs
          </div>

          {/* Heading */}
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-2">
            Create your{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
              account
            </span>
          </h1>

          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Start collaborating, managing projects, and tracking tasks in one
            workspace.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Full Name
              </label>

              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl px-3 py-2.5 focus-within:border-purple-500/40 transition-all duration-300">
                <User className="w-4 h-4 text-gray-500" />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Email Address
              </label>

              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl px-3 py-2.5 focus-within:border-pink-500/40 transition-all duration-300">
                <Mail className="w-4 h-4 text-gray-500" />

                <input
                  type="email"
                  name="email"
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

              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl px-3 py-2.5 focus-within:border-purple-500/40 transition-all duration-300">
                <Lock className="w-4 h-4 text-gray-500" />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create password"
                  className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Confirm Password
              </label>

              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl px-3 py-2.5 focus-within:border-pink-500/40 transition-all duration-300">
                <Lock className="w-4 h-4 text-gray-500" />

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm password"
                  className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/20 hover:scale-[1.02] hover:shadow-purple-500/40 transition-all duration-300"
            >
              Create Account
              <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-5 text-center">
            <p className="text-xs text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-300 hover:text-pink-300 transition"
              >
                Login
              </Link>
            </p>
          </div>

          {/* Message */}
          {message && (
            <p className="mt-4 text-center text-xs text-green-400 font-medium">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
