import React from "react";
import { UserMinus, AlertTriangle } from "lucide-react";

const ConfirmRemoveMember = ({ onClose, onConfirm, memberName }) => {
  return (
    <div className="text-white">
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5">
        <AlertTriangle className="w-7 h-7 text-orange-400" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-orange-400 to-pink-500 text-transparent bg-clip-text">
        Remove Member
      </h2>

      {/* Description */}
      <p className="text-gray-300 leading-relaxed mb-6">
        Are you sure you want to remove{" "}
        <span className="font-semibold text-white">{memberName}</span> from this
        project?
        <span className="block mt-2 text-orange-400 font-medium">
          This action cannot be undone.
        </span>
      </p>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-orange-500/20"
        >
          <UserMinus className="w-4 h-4" />
          Remove
        </button>
      </div>
    </div>
  );
};

export default ConfirmRemoveMember;



