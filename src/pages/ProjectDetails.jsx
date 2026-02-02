// src/pages/ProjectDetails.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Trash } from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import {
  fetchProjectById,
  removeMemberFromProject,
} from "../services/projectService";
import { fetchTasks, deleteTask } from "../services/taskService";

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

  // Data
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState(null);

  // UI state
  const [loadingCompo, setLoadingCompo] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("tasks"); // default tab

  // Modals
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTaskDeleteOpen, setTaskDeleteOpen] = useState(false);

  // Selections
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Redirect if no user
  useEffect(() => {
    if (!loading && user === null) {
      navigate("/signup");
    }
  }, [user, navigate]);

  // Fetch project + tasks
  const fetchProject = async () => {
    try {
      const data = await fetchProjectById(id);
      setProject(data);

      const taskList = await fetchTasks(id);
      setTasks(taskList);
    } catch (err) {
      console.error("Error fetching project:", err.response.data.message);
      if (err.response.data.message === "Unauthorized access") {
        showError("Please login");
        setError("Failed to load project details. please login first . . .");
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

  // Handlers
  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    try {
      await removeMemberFromProject(project._id, selectedMember.email);
      const updatedMembers = project.members.filter(
        (member) => member.email !== selectedMember.email
      );
      setProject({ ...project, members: updatedMembers });
      setIsDeleteModalOpen(false);
      showSuccess("Member removed");
      setSelectedMember(null);
    } catch (error) {
      console.error("Error removing member:", error);
      showError("Failed to remove member. Please try again.");
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    try {
      await deleteTask(selectedTask);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== selectedTask)
      );
      setTaskDeleteOpen(false);
      showSuccess("Task deleted");
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      showError("Failed to delete task. Please try again.");
    }
  };

  // Early returns
  if (loadingCompo) {
    return <p className="p-6 text-gray-500">Loading project details...</p>;
  }
  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }
  if (!project) {
    return <p className="p-6 text-gray-500">No project found.</p>;
  }

  // Tab components
  const TasksComponent = () => (
    <>
      <div className="flex flex-wrap justify-between mb-4 gap-3 border-b-2 p-4 border-gray-200 rounded-2xl shadow">
        <h1 className="font-bold text-gray-700 text-xl">📋 Tasks</h1>
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          + Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.length === 0 ? (
          <p className="text-gray-500 col-span-2 text-center py-10">
            No tasks yet. Click <span className="font-semibold">+ Create</span>{" "}
            to start one. It would help you to achieve your goal
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="relative p-6 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 border border-gray-200"
            >
              {/* Delete Button */}
              {canEdit(user, task, project) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTask(task._id);
                    setTaskDeleteOpen(true);
                  }}
                  className="absolute top-3 right-3 p-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 transition"
                  title="Delete Task"
                  aria-label="Delete Task"
                >
                  <Trash size={18} />
                </button>
              )}

              {/* Task Card */}
              <Link to={`/project/task/${task._id}`} className="block">
                <h2 className="text-xl font-semibold text-gray-900">
                  {task.title}
                </h2>
                <p className="text-gray-600 mt-2 whitespace-pre-line line-clamp-2">
                  {task.description}
                </p>
                <div className="flex justify-between text-gray-600 mt-3 text-[10px]">
                  <p>
                    <span className="text-black">status: </span>
                    {task.status}
                  </p>
                  <p className=" ">
                    {task.assignedTo.name}{" "}
                    <span className="text-gray-400">
                      ({task.assignedTo.email})
                    </span>
                  </p>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );

  const MembersComponent = () => (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Members</h2>
        <button
          onClick={() => setIsMemberModalOpen(true)}
          className="px-2 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          + Add Member
        </button>
      </div>

      {project.members.length > 0 ? (
        <ul className="space-y-2">
          {project.members.map((member) => (
            <li
              key={member._id}
              className="flex justify-between items-center border-b border-gray-200 pb-2"
            >
              <div>
                <span className="font-medium">{member.name}</span>{" "}
                <span className="text-sm text-gray-600">({member.email})</span>
              </div>
              {canEdit(user, project) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMember(member);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 transition"
                  title="Remove Member"
                  aria-label="Remove Member"
                >
                  <Trash size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No members assigned.</p>
      )}
    </div>
  );

  const MoreDetails = () => (
    <>
      {/* Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl shadow border">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Details</h2>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span className="capitalize">{project.status}</span>
          </p>
          <p>
            <span className="font-medium">Start Date:</span>{" "}
            {new Date(project.startDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">End Date:</span>{" "}
            {new Date(project.endDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Created At:</span>{" "}
            {new Date(project.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Created By
          </h2>
          <p className="font-medium">{project.createdBy.name}</p>
          <p className="text-gray-600">{project.createdBy.email}</p>
        </div>
      </div>
    </>
  );
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{project.title}</h1>
        {canEdit(user, project) && (
          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="px-2 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Edit Project
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-6">{project.description}</p>

      {/* Tabs */}
      <div>
        <div className="flex justify-around gap-1 shadow rounded-xl mb-2 text-center font-bold">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`p-2 w-100 rounded-2xl transition ${
              activeTab === "tasks"
                ? "bg-indigo-600 text-white"
                : "hover:bg-indigo-600 hover:text-white opacity-80"
            }`}
          >
            Tasks
          </button>

          <button
            onClick={() => setActiveTab("members")}
            className={`p-2 w-100 rounded-2xl transition ${
              activeTab === "members"
                ? "bg-indigo-600 text-white"
                : "hover:bg-indigo-600 hover:text-white opacity-80"
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`p-2 w-100 rounded-2xl transition ${
              activeTab === "details"
                ? "bg-green-500 text-white"
                : "hover:bg-green-300 opacity-80"
            }`}
          >
            More Details
          </button>
        </div>

        <div className="p-4 mb-6 border rounded-xl shadow">
          {activeTab === "tasks" && <TasksComponent />}
          {activeTab === "members" && <MembersComponent />}
          {activeTab === "details" && <MoreDetails />}
        </div>
      </div>

      {/* Chat button */}
      <ChatButton conversationId={id} conversationType={"project"} />

      {/* ------------------ Modals ------------------ */}

      {/* Edit Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-30 backdrop-blur-sm"
            onClick={() => setIsProjectModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md z-10">
            <button
              onClick={() => setIsProjectModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <UpdateProject
              onClose={() => setIsProjectModalOpen(false)}
              projectId={project._id}
              existingData={project}
              onProjectUpdated={(updatedProject) =>
                setProject({ ...project, ...updatedProject })
              }
            />
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-30 backdrop-blur-sm"
            onClick={() => setIsMemberModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md z-10">
            <button
              onClick={() => setIsMemberModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <AddMember
              projectId={project._id}
              onClose={() => setIsMemberModalOpen(false)}
              onMemberAdded={(updatedMembers) =>
                setProject({ ...project, members: updatedMembers })
              }
            />
          </div>
        </div>
      )}

      {/* Delete Member Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-30 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md z-10">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <ConfirmRemoveMember
              memberName={selectedMember?.name}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handleRemoveMember}
            />
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-30 backdrop-blur-sm"
            onClick={() => setIsTaskModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md z-10 max-h-[95vh] overflow-y-auto">
            <button
              onClick={() => setIsTaskModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <CreateTask
              projectId={project._id}
              members={project.members}
              onClose={() => setIsTaskModalOpen(false)}
              onTaskCreated={(task) => {
                setTasks((prevTasks) => [...prevTasks, task]);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Task Modal */}
      {isTaskDeleteOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-30 backdrop-blur-sm"
            onClick={() => setTaskDeleteOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md z-10">
            <button
              onClick={() => setTaskDeleteOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <ConfirmTaskDelete
              onClose={() => setTaskDeleteOpen(false)}
              onConfirm={handleDeleteTask}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
