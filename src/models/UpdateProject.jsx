// it would be used for updating the exiting oppend project
import React, { useState, useEffect } from "react";
import { updateProject } from "../services/projectService"; // <-- import the API function
import { showError, showSuccess } from "../utils/toastStyles";
const UpdateProject = ({
  onClose,
  projectId,
  existingData,
  onProjectUpdated,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
    startDate: "",
    endDate: "",
  });
  useEffect(() => {
    if (existingData) {
      setFormData({
        title: existingData.title || "",
        description: existingData.description || "",
        status: existingData.status || "active",
        startDate: existingData.startDate
          ? existingData.startDate.split("T")[0]
          : "",
        endDate: existingData.endDate ? existingData.endDate.split("T")[0] : "",
      });
    }
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProject(projectId, formData);
      onProjectUpdated(formData);
      showSuccess("Project updated");
      onClose();
    } catch (error) {
      console.error("Error updating project:", error);
      showError(error.response?.data?.message || "Failed to create project ❌");
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Update Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Example field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter project title"
            required
          />
        </div>
        {/* More fields here... */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            rows="2"
            className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter the description of the project"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="active">active</option>
            <option value="completed">completed</option>
            <option value="on-hold">on-hold</option>
            <option value="archived">archived</option>
            <option value="draft">draft</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
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
            Update
          </button>
        </div>
      </form>
    </div>
  );
};
export default UpdateProject;
