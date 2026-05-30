// src/pages/ProjectDetails.jsx

import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getSocket } from "../utils/socket";

import {
  Trash,
  Users,
  ClipboardList,
  Info,
  Calendar,
  Sparkles,
  Plus,
  ArrowRight,
  FolderKanban,
  LayoutDashboard,
  Activity,
  CheckCircle2,
  Pencil,
  MoveRight,
  Trash2,
} from "lucide-react";

import KanbanBoard from "../components/KanbanBoard";

import { AuthContext } from "../context/AuthContext";

import {
  fetchProjectById,
  removeMemberFromProject,
} from "../services/projectService";

import { fetchProjectActivities } from "../services/activity";

import { fetchTasks, deleteTask } from "../services/taskService";

import {
  createComment,
  fetchComments,
  deleteComment,
} from "../services/commentService";

import UpdateProject from "../models/UpdateProject";
import AddMember from "../models/AddMember";
import ConfirmRemoveMember from "../models/ConfirmRemoveMember";
import CreateTask from "../models/CreateTask";
import ConfirmTaskDelete from "../models/ConfirmTaskDelete";

import { showError, showSuccess } from "../utils/toastStyles";

import { canEdit } from "../utils/permissions";

import ChatButton from "../components/ChatButton";

const ProjectDetails = () => {
  const { user, loading } = useContext(AuthContext);

  const { id } = useParams();
  const navigate = useNavigate();
  const socket = getSocket();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  const [loadingCompo, setLoadingCompo] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("tasks");

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const [isTaskDeleteOpen, setTaskDeleteOpen] = useState(false);

  const [selectedMember, setSelectedMember] = useState(null);

  const [selectedTask, setSelectedTask] = useState(null);

  const [comments, setComments] = useState([]);

  const [commentInput, setCommentInput] = useState("");

  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    if (!loading && user === null) {
      navigate("/signup");
    }
  }, [user, navigate]);

  const fetchProject = async () => {
    try {
      const data = await fetchProjectById(id);

      setProject(data);

      const taskList = await fetchTasks(id);

      setTasks(taskList);

      const activityList = await fetchProjectActivities(id);

      setActivities(activityList);
    } catch (err) {
      if (err.response?.data?.message === "Unauthorized access") {
        showError("Please login");

        setError("Failed to load project details. Please login first...");

        navigate("/login");
      } else {
        setError("Failed to load project details.");
      }
    } finally {
      setLoadingCompo(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  // Realtime task sync
  useEffect(() => {
    if (!id) return;

    // join project room
    socket.emit("joinProject", {
      projectId: id,
    });

    // task created
    socket.on("taskCreated", (task) => {
      if (!task || !task._id) return;

      setTasks((prev = []) => {
        const cleanPrev = prev.filter(Boolean);

        const exists = cleanPrev.some((t) => t?._id === task._id);

        if (exists) {
          return cleanPrev;
        }

        return [...cleanPrev, task];
      });
    });

    // task updated
    socket.on("taskUpdated", (updatedTask) => {
      if (!updatedTask || !updatedTask._id) return;

      setTasks((prev = []) =>
        prev
          .filter(Boolean)
          .map((t) => (t?._id === updatedTask._id ? updatedTask : t)),
      );
    });

    // task deleted
    socket.on("taskDeleted", ({ taskId }) => {
      if (!taskId) return;

      setTasks((prev = []) => prev.filter((t) => t && t._id !== taskId));
    });

    // activity created
    socket.on("activityCreated", (activity) => {
      if (!activity || !activity._id) return;

      setActivities((prev = []) => {
        const cleanPrev = prev.filter(Boolean);

        const exists = cleanPrev.some((a) => a?._id === activity._id);

        if (exists) {
          return cleanPrev;
        }

        return [activity, ...cleanPrev];
      });
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
      socket.off("activityCreated");
    };
  }, [id]);

  const handleRemoveMember = async () => {
    if (!selectedMember) return;

    try {
      await removeMemberFromProject(project._id, selectedMember.email);

      const updatedMembers = project.members.filter(
        (member) => member.email !== selectedMember.email,
      );

      setProject({
        ...project,
        members: updatedMembers,
      });

      setIsDeleteModalOpen(false);

      showSuccess("Member removed");

      setSelectedMember(null);
    } catch {
      showError("Failed to remove member. Please try again.");
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    try {
      await deleteTask(selectedTask);

      setTasks((prev) => prev.filter((task) => task._id !== selectedTask));

      setTaskDeleteOpen(false);

      showSuccess("Task deleted");

      setSelectedTask(null);
    } catch {
      showError("Failed to delete task.");
    }
  };

  // Loading State
  if (loadingCompo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b17] text-gray-400">
        Loading project details...
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b17] text-red-400">
        {error}
      </div>
    );
  }

  // No Project
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b17] text-gray-400">
        No project found.
      </div>
    );
  }

  const tabs = [
    {
      key: "tasks",
      label: "Tasks",
      icon: ClipboardList,
    },

    {
      key: "board",
      label: "Board",
      icon: LayoutDashboard,
    },

    {
      key: "members",
      label: "Members",
      icon: Users,
    },

    {
      key: "activity",
      label: "Activity",
      icon: Sparkles,
    },

    {
      key: "details",
      label: "Details",
      icon: Info,
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "TASK_CREATED":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;

      case "TASK_UPDATED":
        return <Pencil className="w-4 h-4 text-blue-400" />;

      case "TASK_MOVED":
        return <MoveRight className="w-4 h-4 text-purple-400" />;

      case "TASK_DELETED":
        return <Trash2 className="w-4 h-4 text-red-400" />;

      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days} day ago`;
  };

  return (
    <div className="min-h-screen bg-[#0b0b17] text-white relative overflow-hidden px-4 md:px-6 py-8">
      {/* Background Glow */}
      <div className="absolute w-[350px] h-[350px] bg-purple-600/20 blur-[120px] top-[-120px] left-[-100px]" />
      <div className="absolute w-[350px] h-[350px] bg-pink-500/20 blur-[120px] bottom-[-120px] right-[-100px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HERO CARD */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 shadow-2xl mb-8">
          {/* Glow */}
          <div className="absolute -top-24 right-0 w-72 h-72 bg-purple-500/10 blur-[120px]" />

          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-purple-300 mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Active Workspace
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Left */}
            <div className="flex-1">
              <div className="flex items-start gap-5">
                {/* Icon */}
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center shrink-0">
                  <FolderKanban className="w-8 h-8 text-purple-300" />
                </div>

                {/* Info */}
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-white via-purple-200 to-pink-300 text-transparent bg-clip-text">
                    {project.title}
                  </h1>

                  <p className="text-gray-400 mt-4 max-w-3xl leading-relaxed text-sm md:text-base">
                    {project.description ||
                      "No description added for this project."}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-300">
                      👥 {project.members?.length || 0} Members
                    </div>

                    <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-300">
                      📋 {tasks?.length || 0} Tasks
                    </div>

                    <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-300 capitalize">
                      🚀 {project.status || "Active"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            {canEdit(user, project) && (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsProjectModalOpen(true)}
                  className="z-10 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 font-medium hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-purple-500/20"
                >
                  Edit Project
                </button>

                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="z-10 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  Create Task
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 border-transparent text-white shadow-lg shadow-purple-500/20"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CONTENT CARD */}
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 md:p-8 shadow-2xl">
          {/* TASKS TAB */}
          {activeTab === "tasks" && (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Project Tasks
                  </h2>

                  <p className="text-gray-400 mt-1">
                    Manage and track all project tasks.
                  </p>
                </div>

                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.03] transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>

              {/* Tasks Grid */}
              {tasks.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                  <ClipboardList className="w-14 h-14 text-gray-600 mx-auto mb-4" />

                  <h3 className="text-xl font-semibold text-white mb-2">
                    No tasks yet
                  </h3>

                  <p className="text-gray-400">
                    Create your first task to get started.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] hover:border-purple-500/20 transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Glow */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition duration-500" />

                      <div className="relative p-6">
                        {/* Delete */}
                        {canEdit(user, task, project) && (
                          <button
                            onClick={() => {
                              setSelectedTask(task._id);

                              setTaskDeleteOpen(true);
                            }}
                            className="absolute top-4 right-4 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
                          >
                            <Trash size={15} />
                          </button>
                        )}

                        <Link to={`/project/task/${task._id}`}>
                          <h3 className="text-xl font-semibold text-white mb-3 line-clamp-1">
                            {task.title}
                          </h3>

                          <p className="text-gray-400 leading-relaxed line-clamp-3 min-h-[72px]">
                            {task.description || "No description available."}
                          </p>

                          {/* Footer */}
                          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 capitalize">
                              {task.status}
                            </span>

                            <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-white transition">
                              Open
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* BOARD TAB */}
          {activeTab === "board" && (
            <KanbanBoard tasks={tasks} setTasks={setTasks} project={project} />
          )}

          {/* MEMBERS TAB */}
          {activeTab === "members" && (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-semibold">Team Members</h2>

                  <p className="text-gray-400 mt-1">
                    Collaborators working on this project.
                  </p>
                </div>

                <button
                  onClick={() => setIsMemberModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.03] transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Add Member
                </button>
              </div>

              {/* Members */}
              <div className="grid md:grid-cols-2 gap-5">
                {project.members.map((m) => (
                  <div
                    key={m._id}
                    className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/20 transition"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center text-lg font-semibold text-purple-300">
                        {m.name?.charAt(0)}
                      </div>

                      <div>
                        <h3 className="font-medium text-white">{m.name}</h3>

                        <p className="text-sm text-gray-400">{m.email}</p>
                      </div>
                    </div>

                    {canEdit(user, project) && (
                      <button
                        onClick={() => {
                          setSelectedMember(m);

                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
                      >
                        <Trash size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ACTIVITY TAB */}

          {activeTab === "activity" && (
            <>
              {/* Header */}

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Activity Timeline
                  </h2>

                  <p className="text-gray-400 mt-2">
                    Realtime project collaboration and updates.
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Live Feed
                </div>
              </div>

              {/* Empty State */}

              {activities.length === 0 ? (
                <div className="text-center py-24 rounded-[32px] border border-dashed border-white/10 bg-white/[0.02]">
                  <Sparkles className="w-14 h-14 text-gray-600 mx-auto mb-5" />

                  <h3 className="text-2xl font-semibold text-white mb-3">
                    No activity yet
                  </h3>

                  <p className="text-gray-400 max-w-md mx-auto">
                    Team actions and project updates will appear here in
                    realtime.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline Line */}

                  <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/40 via-white/10 to-transparent" />

                  <div className="space-y-6">
                    {activities.map((activity) => (
                      <div
                        key={activity._id}
                        className="group relative flex gap-5"
                      >
                        {/* Timeline Dot */}

                        <div className="relative z-10 mt-1">
                          <div className="w-12 h-12 rounded-2xl border border-white/10 bg-[#111827] flex items-center justify-center shadow-lg shadow-black/30">
                            {getActivityIcon(activity.type)}
                          </div>
                        </div>

                        {/* Card */}

                        <div className="flex-1 rounded-[28px] border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-purple-500/20 transition-all duration-300 overflow-hidden">
                          {/* Glow */}

                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
                            <div className="absolute -top-20 right-0 w-52 h-52 bg-purple-500/10 blur-3xl" />
                          </div>

                          <div className="relative p-5 md:p-6">
                            <div className="flex items-start justify-between gap-4">
                              {/* Left */}

                              <div className="flex items-start gap-4 min-w-0">
                                {/* Avatar */}

                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold shrink-0">
                                  {activity.userId?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                                </div>

                                {/* Content */}

                                <div className="min-w-0">
                                  <p className="text-gray-100 leading-relaxed text-sm md:text-base">
                                    {activity.message}
                                  </p>

                                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                                    <span className="text-xs text-gray-500">
                                      {getRelativeTime(activity.createdAt)}
                                    </span>

                                    <span className="w-1 h-1 rounded-full bg-gray-600" />

                                    <span className="text-xs text-gray-500">
                                      {new Date(
                                        activity.createdAt,
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Right Badge */}

                              <div className="hidden sm:flex px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs text-gray-400 shrink-0">
                                {activity.type
                                  ?.replaceAll("_", " ")
                                  ?.toLowerCase()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* DETAILS TAB */}
          {activeTab === "details" && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Project Information
                </h2>

                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-300" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">Start Date</p>

                      <p className="text-white font-medium">
                        {new Date(project.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                      <Info className="w-5 h-5 text-pink-300" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">Status</p>

                      <p className="capitalize text-white font-medium">
                        {project.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-xl font-semibold mb-6">Project Owner</h2>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center text-xl font-semibold text-purple-300">
                    {project.createdBy?.name?.charAt(0)}
                  </div>

                  <div>
                    <p className="text-lg font-medium text-white">
                      {project.createdBy?.name}
                    </p>

                    <p className="text-gray-400">{project.createdBy?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Button */}
        <ChatButton
          conversationId={id}
          conversationType={"project"}
          Name={project.title}
          members={project.members}
        />
      </div>

      {/* REGULAR MODALS */}
      {[isProjectModalOpen, isMemberModalOpen, isTaskModalOpen].map(
        (open, i) =>
          open && (
            <div
              key={i}
              className="fixed inset-0 flex items-center justify-center z-50 px-4"
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

              {/* Wrapper */}
              <div className="relative w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
                {/* Inner */}
                <div className="relative bg-[#0b0b17] border border-white/10 rounded-3xl p-4 max-h-[95vh] overflow-x-hidden overflow-y-auto">
                  {/* Glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full" />

                  {/* Close */}
                  <button
                    onClick={() => {
                      setIsProjectModalOpen(false);
                      setIsMemberModalOpen(false);
                      setIsTaskModalOpen(false);
                    }}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition z-20"
                  >
                    ✕
                  </button>

                  <div className="relative z-10">
                    {isProjectModalOpen && (
                      <UpdateProject
                        onClose={() => setIsProjectModalOpen(false)}
                        projectId={project._id}
                        existingData={project}
                        onProjectUpdated={(updated) =>
                          setProject({
                            ...project,
                            ...updated,
                          })
                        }
                      />
                    )}

                    {isMemberModalOpen && (
                      <AddMember
                        projectId={project._id}
                        onClose={() => setIsMemberModalOpen(false)}
                        onMemberAdded={(updatedMembers) =>
                          setProject({
                            ...project,
                            members: updatedMembers,
                          })
                        }
                      />
                    )}

                    {isTaskModalOpen && (
                      <CreateTask
                        projectId={project._id}
                        members={project.members}
                        onClose={() => setIsTaskModalOpen(false)}
                        onTaskCreated={(task) =>
                          setTasks((prev) => [...prev, task])
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ),
      )}

      {/* DELETE MODALS */}
      {(isDeleteModalOpen || isTaskDeleteOpen) && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          {/* Danger Card */}
          <div className="relative w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-br from-red-500/20 via-pink-500/10 to-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.18)] animate-in fade-in zoom-in-95 duration-200">
            <div className="relative overflow-hidden bg-[#0b0b17] border border-white/10 rounded-3xl p-6">
              {/* Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/15 blur-3xl rounded-full" />

              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/10 blur-3xl rounded-full" />

              {/* Close */}
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setTaskDeleteOpen(false);
                }}
                className="absolute top-4 right-4 z-20 text-gray-500 hover:text-white transition"
              >
                ✕
              </button>

              <div className="relative z-10">
                {isDeleteModalOpen && (
                  <ConfirmRemoveMember
                    memberName={selectedMember?.name}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleRemoveMember}
                  />
                )}

                {isTaskDeleteOpen && (
                  <ConfirmTaskDelete
                    onClose={() => setTaskDeleteOpen(false)}
                    onConfirm={handleDeleteTask}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
