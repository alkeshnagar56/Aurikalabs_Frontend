import React from "react";

const ConfirmDelete = ({ onClose, onConfirm }) => {
  return (
    <div className="p-6 w-full max-w-md z-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Delete Project
      </h2>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this project? 
        <span className="font-semibold text-red-600"> This action cannot be undone.</span>
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ConfirmDelete;
