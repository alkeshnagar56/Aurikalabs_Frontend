import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  X,
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  User,
  LogOut,
  Sparkles,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";

import { logoutUser } from "../services/authService";

import { showError } from "../utils/toastStyles";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");

      setMenuOpen(false);
    } catch (err) {
      showError(
        err?.response?.data?.message || "Unable to logout. Please try again.",
      );
    }
  };

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },

    {
      name: "Associated Projects",
      path: "/associatedprojects",
      icon: FolderKanban,
    },

    {
      name: "Assigned Tasks",
      path: "/assignedtasks",
      icon: ClipboardList,
    },

    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b17]/70 backdrop-blur-2xl">
        {/* <nav className="sticky top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#070711]/70 border-b border-white/10"> */}
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/[0.03] via-transparent to-pink-500/[0.03]" />

        <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles size={18} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent">
                Aurika Labs
              </h1>

              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 hidden md:block">
                Project Workspace
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-5">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-all duration-300"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/20 hover:scale-105 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {/* Profile Button */}

                <button
                  onClick={() => setMenuOpen(true)}
                  className="group relative"
                >
                  <div className="w-11 h-11 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-purple-500/20 border border-white/10 group-hover:scale-105 transition-all duration-300">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user?.name}'s avatar`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0)?.toUpperCase() || "U"
                    )}
                  </div>

                  {/* Online Dot */}

                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#0b0b17]" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            {!user ? (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm text-gray-300">
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-sm"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button onClick={() => setMenuOpen(true)} className="relative">
                <div className="w-11 h-11 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold border border-white/10">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user?.name}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>

                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#0b0b17]" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      {menuOpen && user && (
        <div className="fixed inset-0 z-[100]">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="absolute right-0 top-0 h-full w-[320px] bg-[#0b0b17]/95 backdrop-blur-2xl border-l border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.12)] overflow-hidden">
            {/* Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full" />

            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/10 blur-3xl rounded-full" />

            <div className="relative z-10 flex flex-col h-full p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-purple-500/20">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user?.name}'s avatar`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user?.name?.charAt(0)?.toUpperCase() || "U"
                      )}
                    </div>

                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-400 border-4 border-[#0b0b17]" />
                  </div>

                  {/* Info */}
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {user.name}
                    </h2>

                    <p className="text-sm text-gray-400 truncate max-w-[170px]">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Close */}
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation */}

              <div className="space-y-2 overflow-y-auto pr-1">
                {/* Main Navigation */}

                {navLinks.map((item) => {
                  const Icon = item.icon;

                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/20 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-white/5 text-gray-400 group-hover:text-white"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-auto pt-6">
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
        </div>
      )}
    </>
  );
};

export default Navbar;
