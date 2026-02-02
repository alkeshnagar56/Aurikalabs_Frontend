import React from "react";

const ConfirmRemoveMember = ({ onClose, onConfirm, memberName }) => {
  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Remove Member
      </h2>
      <p className="text-gray-600 mb-6">
        Are you sure you want to remove{" "}
        <span className="font-medium text-gray-900">{memberName}</span> from
        this project? This action cannot be undone.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Remove
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmRemoveMember;
