// src/components/KanbanBoard.jsx

import React from "react";

import { Circle, Clock3, CheckCircle2, Flag, GripVertical } from "lucide-react";

import { updateTask } from "../services/taskService";

import { getSocket } from "../utils/socket";

const KanbanBoard = ({ tasks = [], setTasks }) => {
  const socket = getSocket();

  // SAFETY FILTER
  const safeTasks = tasks.filter((t) => t && t._id);

  // Group tasks by status
  const columns = {
    "to-do": safeTasks.filter((t) => t.status === "to-do"),

    "in-progress": safeTasks.filter((t) => t.status === "in-progress"),

    done: safeTasks.filter((t) => t.status === "done"),
  };

  // Column styles
  const columnStyles = {
    "to-do": "from-slate-500/10 to-slate-700/10 border-slate-500/20",

    "in-progress": "from-purple-500/10 to-pink-500/10 border-purple-500/20",

    done: "from-emerald-500/10 to-green-500/10 border-emerald-500/20",
  };

  // Column icons
  const columnIcons = {
    "to-do": Circle,

    "in-progress": Clock3,

    done: CheckCircle2,
  };

  // Drag Start
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  // Drop
  const handleDrop = async (e, newStatus) => {
    e.preventDefault();

    const taskId = e.dataTransfer.getData("taskId");

    const task = safeTasks.find((t) => t._id === taskId);

    if (!task || task.status === newStatus) return;

    // Backup for rollback
    const previousTasks = [...safeTasks];

    // Optimistic UI update
    const updatedTasks = safeTasks.map((t) =>
      t._id === taskId
        ? {
            ...t,
            status: newStatus,
          }
        : t,
    );

    setTasks(updatedTasks);

    try {
      const res = await updateTask(taskId, {
        status: newStatus,
      });

      const updatedTask = res.task || res.data?.task;

      if (!updatedTask) return;

      // Sync with backend
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updatedTask : t)));

      // Realtime sync
      socket.emit("taskUpdated", {
        task: updatedTask,
      });
    } catch (err) {
      console.error(err);

      // Rollback if failed
      setTasks(previousTasks);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {Object.entries(columns).map(([status, columnTasks]) => {
        const Icon = columnIcons[status];

        return (
          <div
            key={status}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, status)}
            className={`relative overflow-hidden rounded-3xl border bg-gradient-to-b backdrop-blur-2xl min-h-[650px] p-5 transition-all duration-300 ${columnStyles[status]}`}
          >
            {/* Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/[0.03] blur-3xl rounded-full" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold capitalize text-white">
                    {status.replace("-", " ")}
                  </h2>

                  <p className="text-sm text-gray-400">
                    {columnTasks.length} Tasks
                  </p>
                </div>
              </div>

              <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300">
                {columnTasks.length}
              </div>
            </div>

            {/* Tasks */}
            <div className="relative z-10 space-y-4">
              {columnTasks.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded-3xl p-8 text-center bg-white/[0.02]">
                  <p className="text-sm text-gray-500">Drag tasks here</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id)}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/80 backdrop-blur-xl p-5 cursor-grab active:cursor-grabbing hover:border-purple-500/20 hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Hover Glow */}
                    <div className="absolute -top-10 -right-10 w-28 h-28 bg-purple-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition duration-500" />

                    {/* Drag Icon */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition">
                      <GripVertical className="w-4 h-4 text-gray-500" />
                    </div>

                    <div className="relative z-10">
                      {/* Title */}
                      <h3 className="text-white font-semibold text-base mb-2 line-clamp-1">
                        {task.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                        {task.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                        {/* Priority */}
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs capitalize border ${
                            task.priority === "high"
                              ? "bg-red-500/10 text-red-300 border-red-500/20"
                              : task.priority === "medium"
                                ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/20"
                                : "bg-green-500/10 text-green-300 border-green-500/20"
                          }`}
                        >
                          <Flag className="w-3 h-3" />

                          {task.priority}
                        </div>

                        {/* Assigned User */}
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center text-xs font-semibold text-white shadow-lg shadow-purple-500/20">
                            {task.assignedTo?.name?.charAt(0)?.toUpperCase() ||
                              "U"}
                          </div>

                          <div className="max-w-[100px]">
                            <p className="text-xs text-gray-300 truncate">
                              {task.assignedTo?.name || "Unassigned"}
                            </p>

                            <p className="text-[10px] text-gray-500 truncate">
                              {task.assignedTo?.email || "No Email"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
