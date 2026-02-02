// src/pages/CreateTask.jsx
import React, { useState } from "react";
import { createTask } from "../services/taskService"; // ✅ you’ll add this in services
import { showError, showSuccess } from "../utils/toastStyles";

const CreateTask = ({ projectId, members, onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "to-do",
    assignedTo: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const taskData = {
        ...formData,
        projectId,
      };

      const newTask = await createTask(taskData);
      onTaskCreated(newTask); // ✅ update parent state
      showSuccess("Task Saved");
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      showError(error.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Task</h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows="3"
          ></textarea>
        </div>

        {/* Assigned To */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assign To
          </label>
          <select
            required
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">-- Select Member --</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name} ({member.email})
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="to-do">To-Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
