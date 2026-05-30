import React, { useContext, useState } from "react";
import { Pencil, Mail, CalendarDays, LogOut, Sparkles } from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import UpdateProfile from "../models/UpdateProfile";

import { updateUserProfile } from "../services/authService";
import { showError, showSuccess } from "../utils/toastStyles";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser, logout } = useContext(AuthContext);

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (updatedData) => {
    try {
      await updateUserProfile(updatedData);

      setUser((prev) => ({
        ...prev,
        ...updatedData,
      }));

      showSuccess("Profile updated successfully");
    } catch (err) {
      console.log(err);

      showError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    await logout();

    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0b17] flex items-center justify-center px-4">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-semibold text-white mb-3">
            Not Logged In
          </h2>

          <p className="text-gray-400">Please login to access your profile.</p>
        </div>
      </div>
    );
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#0b0b17] text-white px-4 py-10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-purple-600/20 blur-[120px] rounded-full" />

      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-pink-500/20 blur-[120px] rounded-full" />

      {/* Main Profile Card */}
      <div className="relative z-10 max-w-md mx-auto">
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_0_50px_rgba(168,85,247,0.12)] p-8">
          {/* Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full" />

          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/10 blur-3xl rounded-full" />

          {/* Edit Button */}
          <button
            onClick={() => setIsUpdateOpen(true)}
            className="absolute top-5 right-5 w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 z-11"
          >
            <Pencil size={18} />
          </button>

          {/* Header */}
          <div className="relative z-10 text-center">
            {/* Avatar */}
            <div className="relative w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center text-4xl font-bold shadow-lg shadow-purple-500/30">
              {user.name?.charAt(0).toUpperCase()}

              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-400 border-4 border-[#0b0b17]" />
            </div>

            {/* Name */}
            <h1 className="mt-6 text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent">
              {user.name}
            </h1>

            {/* Subtitle */}
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-purple-300">
              <Sparkles size={15} />

              <span>Profile Overview</span>
            </div>
          </div>

          {/* User Details */}
          <div className="relative z-10 mt-8 space-y-4">
            {/* Email */}
            <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-2xl p-4">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-300">
                <Mail size={18} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Email Address
                </p>

                <p className="text-sm text-gray-200 mt-1">{user.email}</p>
              </div>
            </div>

            {/* Joined */}
            <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-2xl p-4">
              <div className="w-11 h-11 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-300">
                <CalendarDays size={18} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Joined On
                </p>

                <p className="text-sm text-gray-200 mt-1">{joinedDate}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="relative z-10 mt-8">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-300"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Update Profile Modal */}
      {isUpdateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setIsUpdateOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <UpdateProfile
              user={user}
              onClose={() => setIsUpdateOpen(false)}
              onUpdate={handleUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
