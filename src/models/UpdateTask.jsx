import { useState, useEffect } from "react";
import { getMembers } from "../services/projectService"; // make sure path is correct

const UpdateTask = ({ task, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "to-do",
    startDate: "",
    endDate: "",
    assignedTo: "", // member assignment
  });

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // fill form with task data
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        status: task.status || "to-do",
        startDate: task.startDate ? task.startDate.split("T")[0] : "",
        endDate: task.endDate ? task.endDate.split("T")[0] : "",
        assignedTo: task.assignedTo?._id || "",
      });
    }
  }, [task]);

  // fetch members only when modal is open
  useEffect(() => {
    if (isOpen && task?.projectId) {
      const fetchMembers = async () => {
        try {
          setLoadingMembers(true);
          const membersData = await getMembers(task.projectId);
          // normalize to { _id, name, email }
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      assignedTo: formData.assignedTo ? formData.assignedTo : null,
    };

    onUpdate(task._id, updatedData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md z-10 max-h-[95vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Update Task
        </h2>

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
              rows="3"
              required
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
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

          {/* Assign Member */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assign To
            </label>
            {loadingMembers ? (
              <p className="text-sm text-gray-500">Loading members...</p>
            ) : (
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a member</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            )}
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTask;
