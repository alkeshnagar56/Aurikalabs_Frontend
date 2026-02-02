import React, { useState } from "react";
import { addMemberToProject } from "../services/projectService";
import { showError, showSuccess } from "../utils/toastStyles";

const AddMember = ({ projectId, onClose, onMemberAdded }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { message, members } = await addMemberToProject(projectId, email);
      setEmail(""); // clear input
      onMemberAdded(members, message); // send updated project to parent
      showSuccess("Member added ");
      onClose(); // just close the modal
    } catch (error) {
      console.error("Error adding member:", error);
      showError(error.response?.data?.message || "Failed to add member");
    }
  };

  return (
    <div className="p-6 w-full max-w-md z-10">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Member's Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter member's email"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Add Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMember;
