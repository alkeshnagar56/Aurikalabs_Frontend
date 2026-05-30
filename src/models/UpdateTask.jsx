import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { getMembers } from "../services/projectService";

const UpdateTask = ({ task, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "to-do",
    startDate: null,
    endDate: null,
    assignedTo: "",
  });

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Fill form with task data
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        status: task.status || "to-do",
        startDate: task.startDate ? new Date(task.startDate) : null,
        endDate: task.endDate ? new Date(task.endDate) : null,
        assignedTo: task.assignedTo?._id || "",
      });
    }
  }, [task]);

  // Fetch project members
  useEffect(() => {
    if (isOpen && task?.projectId) {
      const fetchMembers = async () => {
        try {
          setLoadingMembers(true);

          const membersData = await getMembers(task.projectId);

          const cleaned = membersData.map((m) => ({
            _id: m._id,
            name: m.name,
            email: m.email,
          }));

          setMembers(cleaned);
        } catch (error) {
          console.error("Error fetching members:", error);
        } finally {
          setLoadingMembers(false);
        }
      };

      fetchMembers();
    }
  }, [isOpen, task?.projectId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = {
      ...formData,

      startDate: formData.startDate
        ? formData.startDate.toISOString()
        : null,

      endDate: formData.endDate
        ? formData.endDate.toISOString()
        : null,

      assignedTo: formData.assignedTo
        ? formData.assignedTo
        : null,
    };

    onUpdate(task._id, updatedData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Gradient Wrapper */}
      <div className="relative w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.18)] z-10 animate-in fade-in zoom-in-95 duration-200">

        {/* Modal */}
        <div className="relative overflow-hidden bg-[#0b0b17] border border-white/10 rounded-3xl p-6 max-h-[95vh] overflow-y-auto text-white">

          {/* Glow Effects */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/15 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/10 blur-3xl rounded-full" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition z-20"
          >
            ✕
          </button>

          {/* Content */}
          <div className="relative z-10">

            {/* Header */}
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Update Task
            </h2>

            <p className="text-sm text-gray-400 mb-6">
              Update task details, assignments and deadlines.
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 text-left"
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
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 text-white placeholder:text-gray-500 transition-all duration-200"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Description
                </label>

                <textarea
                  name="description"
                  rows="4"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the task..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 text-white placeholder:text-gray-500 transition-all duration-200 resize-none"
                />
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
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 text-white transition-all duration-200"
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
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 text-white transition-all duration-200"
                >
                  <option value="to-do" className="bg-[#0b0b17]">
                    To-Do
                  </option>

                  <option value="in-progress" className="bg-[#0b0b17]">
                    In Progress
                  </option>

                  <option value="done" className="bg-[#0b0b17]">
                    Done
                  </option>
                </select>
              </div>

              {/* Assign Member */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Assign To
                </label>

                {loadingMembers ? (
                  <p className="text-sm text-gray-400">
                    Loading members...
                  </p>
                ) : (
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 text-white transition-all duration-200"
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
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">

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
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 text-white placeholder:text-gray-500 transition-all duration-200"
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
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/40 text-white placeholder:text-gray-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-purple-500/30"
                >
                  Update Task
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTask;