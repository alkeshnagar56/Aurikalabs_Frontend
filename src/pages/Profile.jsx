// src/pages/Profile.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Pencil } from "lucide-react";
import UpdateProfile from "../models/UpdateProfile";
import { updateUserProfile } from "../services/authService";
import { showSuccess } from "../utils/toastStyles";

const Profile = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const handleUpdate = async (updatedData) => {
    try {
      await updateUserProfile(updatedData);
      setUser((prev) => ({
        ...prev,
        ...updatedData,
      }));
      showSuccess("Changes saved");
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-md mx-auto mt-10 mb-3 p-6 bg-white shadow-lg rounded-2xl relative">
      {/* Edit Profile Icon */}
      <button
        onClick={() => setIsUpdateOpen(true)}
        className="absolute top-4 right-4 text-gray-500 hover:text-blue-600 transition"
      >
        <Pencil size={20} />
      </button>

      {/* Avatar */}
      <div className="flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-blue-600 text-white text-3xl font-bold">
        {user.name?.charAt(0).toUpperCase()}
      </div>

      {/* User Info */}
      <div className="text-center mt-4">
        <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
      </div>

      {/* Joined Date */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Joined on{" "}
          <span className="font-medium text-gray-700">{joinedDate}</span>
        </p>
      </div>

      {/* Logout Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition"
        >
          Logout
        </button>
      </div>

      {/* Update Profile Modal */}
      {isUpdateOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-30 backdrop-blur-sm"
            onClick={() => setIsUpdateOpen(false)}
          />
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md z-10">
            <button
              onClick={() => setIsUpdateOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
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
