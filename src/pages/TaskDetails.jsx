import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTaskById, updateTask } from "../services/taskService";
import TaskUpdateModal from "../models/UpdateTask";
import { showSuccess, showError } from "../utils/toastStyles";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { canEdit } from "../utils/permissions";
import ChatButton from "../components/ChatButton";

const TaskDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [onError, setOnError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await fetchTaskById(id);
        setTask(data);
      } catch (err) {
        console.error("Failed to fetch task:", err);
        if (err.response.data.message === "Unauthorized access") {
          showError("Please login");
          setOnError("Failed to load task details. please login first . . .");
          navigate("/login");
        } else {
          setOnError("Failed to load task details...");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const res = await updateTask(taskId, updatedData);
      setTask(res);
      setIsUpdateOpen(false);
      showSuccess("Task updated");
    } catch (error) {
      console.error("Error updating task:", error);
      showError(error.response?.data?.message || "Failed to update task");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading task details...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {onError}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-lg mb-5">
      {/* Title */}
      <div>
        <div className="flex flex-wrap items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          {/* Update Button */}
          <div className="">
            {canEdit(user, task) && (
              <button
                onClick={() => setIsUpdateOpen(true)}
                className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Update Task
              </button>
            )}
          </div>
        </div>
        {/* Assigned Info */}
        <p className="text-sm text-gray-500 mt-1">
          Assigned to: {task.assignedTo?.name}{" "}
          <span className="text-gray-400">({task.assignedTo?.email})</span>
        </p>
      </div>

      {/* Description */}
      <div className="mt-4">
        <h2 className="font-semibold text-gray-800">Description</h2>
        <p className="text-gray-600 mt-2 whitespace-pre-line">
          {task.description}
        </p>
      </div>



      <ChatButton conversationId={id} conversationType={"task"} />

      {/* Modal */}
      {isUpdateOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-30 backdrop-blur-sm"
            onClick={() => setIsUpdateOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md z-10 max-h-[95vh] overflow-y-auto">
            <button
              onClick={() => setIsUpdateOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <TaskUpdateModal
              task={task}
              isOpen={isUpdateOpen}
              onClose={() => setIsUpdateOpen(false)}
              onUpdate={handleUpdateTask}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
