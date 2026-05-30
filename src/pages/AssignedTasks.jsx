import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { assignedtasks } from "../services/taskService";
import { showError } from "../utils/toastStyles";
import {
  ClipboardList,
  CalendarDays,
  Flag,
  Filter,
  ArrowUpDown,
} from "lucide-react";

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
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching assigned tasks:", err);
        showError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchTasks();
  }, [user]);

  // Priority ranking
  const priorityRank = { low: 1, medium: 2, high: 3 };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "all") return true;
    return (task.status || "").toLowerCase() === filterStatus.toLowerCase();
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const aCreated = new Date(a.createdAt).getTime() || 0;
    const bCreated = new Date(b.createdAt).getTime() || 0;

    if (sortOption === "latest") {
      return bCreated - aCreated;
    }

    if (sortOption === "oldest") {
      return aCreated - bCreated;
    }

    if (sortOption === "priorityHigh") {
      const aRank =
        priorityRank[(a.priority || "medium").toLowerCase()] ?? 2;
      const bRank =
        priorityRank[(b.priority || "medium").toLowerCase()] ?? 2;

      return bRank - aRank || bCreated - aCreated;
    }

    if (sortOption === "priorityLow") {
      const aRank =
        priorityRank[(a.priority || "medium").toLowerCase()] ?? 2;
      const bRank =
        priorityRank[(b.priority || "medium").toLowerCase()] ?? 2;

      return aRank - bRank || bCreated - aCreated;
    }

    return 0;
  });

  const getPriorityStyles = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      case "low":
        return "bg-green-500/10 text-green-400 border border-green-500/20";
      default:
        return "bg-white/10 text-gray-300 border border-white/10";
    }
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "done":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "to-do":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      default:
        return "bg-white/10 text-gray-300 border border-white/10";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070710] text-gray-400">
        Please log in to see your assigned tasks.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#070710] text-white">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070710] text-white px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b17] p-6 md:p-8 shadow-2xl">
          
          {/* Glow Effects */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-500/10 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Left */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
                  <ClipboardList className="w-7 h-7 text-purple-400" />
                </div>

                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                    Assigned Tasks
                  </h1>

                  <p className="text-gray-400 text-sm mt-1">
                    Manage and track all tasks assigned to you
                  </p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              
              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all" className="bg-[#111827]">
                    All Status
                  </option>

                  <option value="to-do" className="bg-[#111827]">
                    To-Do
                  </option>

                  <option value="in-progress" className="bg-[#111827]">
                    In Progress
                  </option>

                  <option value="done" className="bg-[#111827]">
                    Done
                  </option>
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="latest" className="bg-[#111827]">
                    Latest Created
                  </option>

                  <option value="oldest" className="bg-[#111827]">
                    Oldest Created
                  </option>

                  <option value="priorityHigh" className="bg-[#111827]">
                    Priority: High → Low
                  </option>

                  <option value="priorityLow" className="bg-[#111827]">
                    Priority: Low → High
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {sortedTasks.length === 0 ? (
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b17] p-10 text-center shadow-xl">
            
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-purple-500/10 blur-3xl rounded-full" />

            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <ClipboardList className="w-10 h-10 text-purple-400" />
              </div>

              <h2 className="text-2xl font-semibold mb-2">
                No Tasks Found
              </h2>

              <p className="text-gray-400">
                No assigned tasks match your current filters.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Task Cards */
        <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {sortedTasks.map((task) => (
            <Link
              to={`/project/task/${task._id}`}
              key={task._id}
              className="group"
            >
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b17] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-purple-500/10">
                
                {/* Glow */}
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition duration-500" />

                <div className="relative z-10">
                  
                  {/* Top */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h2 className="text-xl font-semibold text-white line-clamp-1 group-hover:text-purple-300 transition">
                      {task.title}
                    </h2>

                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${getPriorityStyles(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 min-h-[70px]">
                    {task.description || "No description available"}
                  </p>

                  {/* Status */}
                  <div className="mt-5 flex items-center justify-between">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyles(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {new Date(task.createdAt).toLocaleDateString("en-GB")}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="mt-5 pt-4 border-t border-white/5 space-y-2 text-sm">
                    
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Start Date</span>

                      <span className="text-gray-300">
                        {task.startDate
                          ? new Date(task.startDate).toLocaleDateString(
                              "en-GB"
                            )
                          : "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-400">
                      <span>End Date</span>

                      <span className="text-gray-300">
                        {task.endDate
                          ? new Date(task.endDate).toLocaleDateString("en-GB")
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                    
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Flag className="w-4 h-4 text-purple-400" />
                      <span>Task Details</span>
                    </div>

                    <span className="text-xs text-purple-400 group-hover:text-pink-400 transition">
                      Open →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedTasks;





















// import { useEffect, useState, useContext } from "react";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { assignedtasks } from "../services/taskService";
// import { showError } from "../utils/toastStyles";

// const AssignedTasks = () => {
//   const { user } = useContext(AuthContext);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sortOption, setSortOption] = useState("latest");
//   const [filterStatus, setFilterStatus] = useState("all");

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const data = await assignedtasks();
//         // assignedtasks() might return array or axios response; handle both
//         // const data = res?.data?.tasks ?? res?.data ?? res;
//         setTasks(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Error fetching assigned tasks:", err);
//         showError("Something went wrong")
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user) fetchTasks();
//   }, [user]);

//   // Priority ranking map (low < medium < high)
//   const priorityRank = { low: 1, medium: 2, high: 3 };

//   // Filter by status (values match your schema)
//   const filteredTasks = tasks.filter((task) => {
//     if (filterStatus === "all") return true;
//     return (task.status || "").toLowerCase() === filterStatus.toLowerCase();
//   });

//   // Sort based on selected option
//   const sortedTasks = [...filteredTasks].sort((a, b) => {
//     // safe parse createdAt
//     const aCreated = new Date(a.createdAt).getTime() || 0;
//     const bCreated = new Date(b.createdAt).getTime() || 0;

//     if (sortOption === "latest") {
//       return bCreated - aCreated;
//     }
//     if (sortOption === "oldest") {
//       return aCreated - bCreated;
//     }
//     if (sortOption === "priorityHigh") {
//       const aRank = priorityRank[(a.priority || "medium").toLowerCase()] ?? 2;
//       const bRank = priorityRank[(b.priority || "medium").toLowerCase()] ?? 2;
//       // higher rank first; fallback to latest created if equal
//       return bRank - aRank || bCreated - aCreated;
//     }
//     if (sortOption === "priorityLow") {
//       const aRank = priorityRank[(a.priority || "medium").toLowerCase()] ?? 2;
//       const bRank = priorityRank[(b.priority || "medium").toLowerCase()] ?? 2;
//       // lower rank first; fallback to latest created if equal
//       return aRank - bRank || bCreated - aCreated;
//     }
//     return 0;
//   });

//   if (!user) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-gray-600">Please log in to see your assigned tasks.</p>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-gray-600">Loading tasks...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-6 py-10">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Assigned Tasks</h1>

//         {/* Filters + Sorting */}
//         <div className="flex flex-wrap gap-3">
//           {/* Status Filter (values align with your schema) */}
//           <select
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="all">All Status</option>
//             <option value="to-do">To-Do</option>
//             <option value="in-progress">In Progress</option>
//             <option value="done">Done</option>
//           </select>

//           {/* Sort Dropdown */}
//           <select
//             value={sortOption}
//             onChange={(e) => setSortOption(e.target.value)}
//             className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="latest">Latest Created</option>
//             <option value="oldest">Oldest Created</option>
//             <option value="priorityHigh">Priority: High → Low</option>
//             <option value="priorityLow">Priority: Low → High</option>
//           </select>
//         </div>
//       </div>

//       {sortedTasks.length === 0 ? (
//         <p className="text-gray-600">No tasks match your filters.</p>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {sortedTasks.map((task) => (
//             <Link
//               to={`/project/task/${task._id}`}
//               key={task._id}
//               className="block bg-white rounded-xl shadow hover:shadow-lg transition p-5"
//             >
//               <h2 className="text-lg font-semibold text-blue-700 truncate">
//                 {task.title}
//               </h2>
//               <p className="text-sm text-gray-600 mt-2 line-clamp-2">
//                 {task.description}
//               </p>
//               <div className="mt-4 flex justify-between text-sm text-gray-500">
//                 <span className="capitalize">Status: {task.status}</span>
//                 <span className="capitalize">Priority: {task.priority}</span>
//               </div>
//               <div className="mt-2 text-xs text-gray-400">
//                 Start:{" "}
//                 {task.startDate
//                   ? new Date(task.startDate).toLocaleDateString("en-GB")
//                   : "N/A"}
//                 {" • "} End:{" "}
//                 {task.endDate
//                   ? new Date(task.endDate).toLocaleDateString("en-GB")
//                   : "N/A"}
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssignedTasks;
