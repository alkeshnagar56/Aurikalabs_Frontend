import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { createTask } from "../services/taskService";
import { showError, showSuccess } from "../utils/toastStyles";

const CreateTask = ({
  projectId,
  members,
  onClose,
  onTaskCreated,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "to-do",
    assignedTo: "",
    startDate: null,
    endDate: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const taskData = {
        ...formData,

        projectId,

        startDate: formData.startDate
          ? formData.startDate.toISOString()
          : null,

        endDate: formData.endDate
          ? formData.endDate.toISOString()
          : null,
      };

      const newTask = await createTask(taskData);

      onTaskCreated(newTask);

      showSuccess("Task Created");

      onClose();
    } catch (error) {
      console.error("Error creating task:", error);

      showError(
        error.response?.data?.message ||
          "Failed to create task",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden text-white">

      {/* Glow Effects */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/15 blur-3xl rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/10 blur-3xl rounded-full" />

      {/* Content */}
      <div className="relative z-10">

        {/* Header */}
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Create Task
        </h2>

        <p className="text-sm text-gray-400 mb-6">
          Create and assign a new task to your project members.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Title */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Title
            </label>

            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Description
            </label>

            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the task..."
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 transition-all duration-200 resize-none"
            />
          </div>

          {/* Assign To */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Assign To
            </label>

            <select
              required
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 transition-all duration-200"
            >
              <option value="" className="bg-[#0b0b17]">
                Select a member
              </option>

              {members.map((member) => (
                <option
                  key={member._id}
                  value={member._id}
                  className="bg-[#0b0b17]"
                >
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 transition-all duration-200"
            >
              <option value="low" className="bg-[#0b0b17]">
                Low
              </option>

              <option value="medium" className="bg-[#0b0b17]">
                Medium
              </option>

              <option value="high" className="bg-[#0b0b17]">
                High
              </option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 transition-all duration-200"
            >
              <option value="to-do" className="bg-[#0b0b17]">
                To-Do
              </option>

              <option
                value="in-progress"
                className="bg-[#0b0b17]"
              >
                In Progress
              </option>

              <option value="done" className="bg-[#0b0b17]">
                Done
              </option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Start Date */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Start Date
              </label>

              <DatePicker
                selected={formData.startDate}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: date,
                  }))
                }
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date"
                calendarClassName="bg-[#0b0b17] border border-white/10 text-white rounded-xl"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 transition-all duration-200"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                End Date
              </label>

              <DatePicker
                selected={formData.endDate}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    endDate: date,
                  }))
                }
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date"
                calendarClassName="bg-[#0b0b17] border border-white/10 text-white rounded-xl"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 transition-all duration-200"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">

            {/* Cancel */}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              Cancel
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-purple-500/30 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;