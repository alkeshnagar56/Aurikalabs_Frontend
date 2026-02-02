import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { assignedtasks } from "../services/taskService";
import { showError } from "../utils/toastStyles";

const AssignedTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("latest");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await assignedtasks();
        // assignedtasks() might return array or axios response; handle both
        // const data = res?.data?.tasks ?? res?.data ?? res;
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching assigned tasks:", err);
        showError("Something went wrong")
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchTasks();
  }, [user]);

  // Priority ranking map (low < medium < high)
  const priorityRank = { low: 1, medium: 2, high: 3 };

  // Filter by status (values match your schema)
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "all") return true;
    return (task.status || "").toLowerCase() === filterStatus.toLowerCase();
  });

  // Sort based on selected option
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // safe parse createdAt
    const aCreated = new Date(a.createdAt).getTime() || 0;
    const bCreated = new Date(b.createdAt).getTime() || 0;

    if (sortOption === "latest") {
      return bCreated - aCreated;
    }
    if (sortOption === "oldest") {
      return aCreated - bCreated;
    }
    if (sortOption === "priorityHigh") {
      const aRank = priorityRank[(a.priority || "medium").toLowerCase()] ?? 2;
      const bRank = priorityRank[(b.priority || "medium").toLowerCase()] ?? 2;
      // higher rank first; fallback to latest created if equal
      return bRank - aRank || bCreated - aCreated;
    }
    if (sortOption === "priorityLow") {
      const aRank = priorityRank[(a.priority || "medium").toLowerCase()] ?? 2;
      const bRank = priorityRank[(b.priority || "medium").toLowerCase()] ?? 2;
      // lower rank first; fallback to latest created if equal
      return aRank - bRank || bCreated - aCreated;
    }
    return 0;
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Please log in to see your assigned tasks.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assigned Tasks</h1>

        {/* Filters + Sorting */}
        <div className="flex flex-wrap gap-3">
          {/* Status Filter (values align with your schema) */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="to-do">To-Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="latest">Latest Created</option>
            <option value="oldest">Oldest Created</option>
            <option value="priorityHigh">Priority: High → Low</option>
            <option value="priorityLow">Priority: Low → High</option>
          </select>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <p className="text-gray-600">No tasks match your filters.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTasks.map((task) => (
            <Link
              to={`/project/task/${task._id}`}
              key={task._id}
              className="block bg-white rounded-xl shadow hover:shadow-lg transition p-5"
            >
              <h2 className="text-lg font-semibold text-blue-700 truncate">
                {task.title}
              </h2>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {task.description}
              </p>
              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <span className="capitalize">Status: {task.status}</span>
                <span className="capitalize">Priority: {task.priority}</span>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Start:{" "}
                {task.startDate
                  ? new Date(task.startDate).toLocaleDateString("en-GB")
                  : "N/A"}
                {" • "} End:{" "}
                {task.endDate
                  ? new Date(task.endDate).toLocaleDateString("en-GB")
                  : "N/A"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedTasks;
