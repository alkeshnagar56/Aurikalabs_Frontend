import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { updateProject } from "../services/projectService";
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
    startDate: null,
    endDate: null,
  });

  const [loading, setLoading] = useState(false);

  // Fill existing project data
  useEffect(() => {
    if (existingData) {
      setFormData({
        title: existingData.title || "",
        description: existingData.description || "",
        status: existingData.status || "active",
        startDate: existingData.startDate
          ? new Date(existingData.startDate)
          : null,
        endDate: existingData.endDate
          ? new Date(existingData.endDate)
          : null,
      });
    }
  }, [existingData]);

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
      const updatedData = {
        ...formData,

        startDate: formData.startDate
          ? formData.startDate.toISOString()
          : null,

        endDate: formData.endDate
          ? formData.endDate.toISOString()
          : null,
      };

      await updateProject(projectId, updatedData);

      onProjectUpdated(updatedData);

      showSuccess("Project updated");

      onClose();
    } catch (error) {
      console.error("Error updating project:", error);

      showError(
        error.response?.data?.message || "Failed to update project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden text-white">
      {/* Glow Effects */}
      <div className="absolute -top-24 -right-24 w-52 h-52 bg-purple-500/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-pink-500/10 blur-3xl rounded-full" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 mb-4">
            Edit Existing Project
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-pink-500 text-transparent bg-clip-text">
            Update Project
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Modify project information, timeline, and status.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Title */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Project Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project title"
              required
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
              placeholder="Describe your project..."
              required
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
              required
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

              <option value="draft" className="bg-[#0b0b17]">
                Draft
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

          {/* Footer Buttons */}
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
              {loading ? "Updating..." : "Update Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProject;