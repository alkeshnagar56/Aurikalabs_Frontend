import React from "react";
import { Trash2, AlertTriangle } from "lucide-react";

const ConfirmDelete = ({ onClose, onConfirm }) => {
  return (
    <div className="relative overflow-hidden p-6 text-white">
      {/* Glow Effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/10 blur-3xl rounded-full" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">
          Delete Project
        </h2>

        {/* Description */}
        <p className="text-gray-300 leading-relaxed mb-6">
          Are you sure you want to delete this project?
          <span className="block mt-2 text-red-400 font-medium">
            This action cannot be undone.
          </span>
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all duration-200"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
