import { useState } from "react";
import { User, Mail, Sparkles } from "lucide-react";

const UpdateProfile = ({ onClose, user, onUpdate }) => {
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await onUpdate({
        name,
        email,
      });

      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#0b0b17] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.12)] p-6 text-white">
      
      {/* Glow Effects */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/10 blur-3xl rounded-full" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-purple-400" />

            <p className="text-sm text-purple-300 tracking-wide uppercase">
              Profile Settings
            </p>
          </div>

          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
            Update Profile
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Manage your personal information
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          ✕
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 space-y-5"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Name
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 transition-all duration-300"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="email"
              value={email}
              disabled
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-500 cursor-not-allowed"
            />
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Email address cannot be changed
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-purple-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;