// src/components/Navbar.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { X } from "lucide-react";
import UserAvtar from "../assets/UserAvtar.png";
import { logoutUser } from "../services/authService";
import { showError } from "../utils/toastStyles";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
      setMenuOpen(false);
    } catch (err) {
      showError(err || "Unable to logout, try again");
    }
  };

  return (
    <nav className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-700">
          Aurika Labs
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {!user ? (
            <>
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={() => setMenuOpen(true)}
              className="focus:outline-none"
            >
              <img
                src={user.avatar || UserAvtar}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border"
              />
            </button>
          )}
        </div>

        {/* Mobile Right Side */}
        <div className="md:hidden flex items-center">
          {!user ? (
            <>
              <Link to="/login" className="text-blue-600 hover:underline mr-4">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={() => setMenuOpen(true)}
              className="focus:outline-none"
            >
              <img
                src={user.avatar || UserAvtar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border"
              />
            </button>
          )}
        </div>
      </div>

      {/* Sidebar (only for logged-in users) */}
      {menuOpen && user && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-6 flex flex-col space-y-6">
            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="self-end text-gray-600 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Avatar + Name */}
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar || UserAvtar}
                alt="User Avatar"
                className="w-12 h-12 rounded-full border"
              />
              <span className="text-gray-700 font-medium">{user.name}</span>
            </div>

            {/* Links */}
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>

            <Link
              to="/associatedprojects"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              Associated Projects
            </Link>
            <Link
              to="/assignedtasks"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              Assigned Tasks
            </Link>
            <Link
              to="/profile"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
