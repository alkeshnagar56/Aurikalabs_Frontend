// src/pages/CreateProject.jsx

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { createProject } from "../services/projectService";
import { showSuccess, showError } from "../utils/toastStyles";

const CreateProject = ({ onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
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
      const payload = {
        ...formData,

        startDate: formData.startDate
          ? formData.startDate.toISOString()
          : null,

        endDate: formData.endDate
          ? formData.endDate.toISOString()
          : null,
      };

      const { project } = await createProject(payload);

      onProjectCreated(project);

      showSuccess("Project created");

      onClose();
    } catch (error) {
      console.error("Error creating project:", error);

      showError(
        error.response?.data?.message || "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-[10px] overflow-hidden overflow-y-auto text-white">
      {/* Glow Effects */}
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-purple-500/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-pink-500/10 blur-3xl rounded-full" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 mb-4">
            New Workspace
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-pink-500 text-transparent bg-clip-text">
            Create Project
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Organize tasks, collaborate with members, and track progress.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Project Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter project title"
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Description
            </label>

            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your project..."
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Project Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-[#111827] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="active" className="bg-[#0b0b17]">
                Active
              </option>

              <option value="completed" className="bg-[#0b0b17]">
                Completed
              </option>

              <option value="on-hold" className="bg-[#0b0b17]">
                On Hold
              </option>

              <option value="archived" className="bg-[#0b0b17]">
                Archived
              </option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
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
                placeholderText="Select start date"
                calendarClassName="bg-[#0b0b17] border border-white/10 text-white rounded-2xl"
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
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
                placeholderText="Select end date"
                calendarClassName="bg-[#0b0b17] border border-white/10 text-white rounded-2xl"
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-purple-500/20 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;