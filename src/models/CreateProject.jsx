// src/pages/CreateProject.jsx
import React, { useState } from "react";
import { createProject } from "../services/projectService"; // <-- import the API function
import { showSuccess, showError } from "../utils/toastStyles";

const CreateProject = ({ onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { message, project } = await createProject(formData); // ✅ use API function
      // alert(message); // "Project created successfully"
      onProjectCreated(project);
      onClose();
      showSuccess("Project saved")

    } catch (error) {
      console.error("Error creating project:", error);
      showError(error.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Create New Project
      </h2>

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
            required
            rows="2"
            className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter the description of the project"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="mt-1 w-full p-2 border rounded-lg focus:ring-2
          focus:ring-indigo-500"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">active</option>
            <option value="completed">completed</option>
            <option value="on-hold">on-hold</option>
            <option value="archived">archived</option>
          </select>
        </div>

        <div className="flex gap-4 justify-around">
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
              placeholder="Enter project title"
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
              placeholder="Enter project title"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg mr-2 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
