import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchTaskById, updateTask } from "../services/taskService";

import { fetchTaskActivities } from "../services/activity";

import {
  createComment,
  fetchComments,
  deleteComment,
} from "../services/commentService";

import TaskUpdateModal from "../models/UpdateTask";

import ConfirmDeleteComment from "../models/ConfirmDeleteComment";

import { showSuccess, showError } from "../utils/toastStyles";

import { AuthContext } from "../context/AuthContext";

import { getSocket } from "../utils/socket";

import { canEdit } from "../utils/permissions";

import ChatButton from "../components/ChatButton";

import { MessageSquare, Activity, Trash2 } from "lucide-react";

const TaskDetails = () => {
  const { user } = useContext(AuthContext);
  const socket = getSocket();

  const { id } = useParams();

  const navigate = useNavigate();

  /*
  =========================================
  STATES
  =========================================
  */

  const [task, setTask] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const [onError, setOnError] = useState(null);

  /*
  =========================================
  COMMENTS
  =========================================
  */

  const [comments, setComments] = useState([]);

  const [commentText, setCommentText] = useState("");

  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  /*
  =========================================
  ACTIVITIES
  =========================================
  */

  const [taskActivities, setTaskActivities] = useState([]);

  const [activitiesLoading, setActivitiesLoading] = useState(false);

  /*
  =========================================
  TAB
  =========================================
  */

  const [activeTab, setActiveTab] = useState("discussion");

  /*
  =========================================
  FETCH TASK
  =========================================
  */

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await fetchTaskById(id);

        setTask(data);
      } catch (err) {
        console.error("Failed to fetch task:", err);

        if (err.response?.data?.message === "Unauthorized access") {
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

  // socket connection for activity (joining project room)

  useEffect(() => {
    if (!socket || !task?.projectId) return;

    socket.emit("joinProject", {
      projectId: task.projectId,
    });

    return () => {
      socket.emit("leaveProject", {
        projectId: task.projectId,
      });
    };
  }, [socket, task?.projectId]);

  // activity creation socket connection

  useEffect(() => {
  if (!socket) return;

  const handleActivityCreated = (
    activity,
  ) => {
    console.log(
      "REALTIME ACTIVITY:",
      activity,
    );

    setTaskActivities((prev) => {
      const exists = prev.some(
        (a) => a._id === activity._id,
      );

      if (exists) return prev;

      return [activity, ...prev];
    });
  };

  socket.on(
    "activityCreated",
    handleActivityCreated,
  );

  return () => {
    socket.off(
      "activityCreated",
      handleActivityCreated,
    );
  };
}, [socket]);

  /*
  =========================================
  FETCH COMMENTS
  =========================================
  */

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(id);
        setComments(data || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    if (id) {
      loadComments();
    }
  }, [id]);

  /*
  =========================================
  FETCH ACTIVITIES
  =========================================
  */

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setActivitiesLoading(true);

        const data = await fetchTaskActivities(id);

        setTaskActivities(data);
      } catch (err) {
        console.error("Error fetching task activities:", err);
      } finally {
        setActivitiesLoading(false);
      }
    };

    if (id) {
      loadActivities();
    }
  }, [id]);

  /*
  =========================================
  SOCKET EVENTS
  =========================================
  */
  useEffect(() => {
    if (!socket || !id) return;

    socket.emit("joinTaskRoom", id);

    return () => {
      socket.emit("leaveTaskRoom", id);
    };
  }, [socket, id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("commentCreated", (newComment) => {
      setComments((prev) => {
        const exists = prev.some((c) => c._id === newComment._id);

        if (exists) return prev;

        return [newComment, ...prev];
      });
    });

    socket.on("commentDeleted", ({ commentId }) => {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    });

    return () => {
      socket.off("commentCreated");
      socket.off("commentDeleted");
    };
  }, [socket]);

  /*
  =========================================
  UPDATE TASK
  =========================================
  */

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

  /*
  =========================================
  CREATE COMMENT
  =========================================
  */

  const handleCreateComment = async () => {
    if (!commentText.trim()) return;

    try {
      await createComment(id, {
        message: commentText,
      });

      setCommentText("");
    } catch (error) {
      console.error("Error creating comment:", error);

      showError("Failed to send comment");
    }
  };

  /*
  =========================================
  DELETE COMMENT
  =========================================
  */

  const handleDeleteComment = async () => {
    try {
      await deleteComment(deletingCommentId);

      setComments((prev = []) =>
        prev.filter((comment) => comment._id !== deletingCommentId),
      );

      setIsDeleteOpen(false);

      setDeletingCommentId(null);

      showSuccess("Comment deleted");
    } catch (error) {
      console.error("Error deleting comment:", error);

      showError("Failed to delete comment");
    }
  };

  /*
  =========================================
  LOADING
  =========================================
  */

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400 bg-[#0b0b17]">
        Loading task details...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-400 bg-[#0b0b17]">
        {onError}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b17] px-4 py-10 text-white">
      {/* TASK CARD */}

      <div className="max-w-3xl mx-auto p-6 bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl rounded-2xl mb-5">
        {/* Title */}

        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              {task.title}
            </h1>

            {canEdit(user, task) && (
              <button
                onClick={() => setIsUpdateOpen(true)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition"
              >
                Update Task
              </button>
            )}
          </div>

          {/* Assigned */}

          <p className="text-sm text-gray-400 mt-2">
            Assigned to:{" "}
            <span className="text-gray-200 font-medium">
              {task.assignedTo?.name}
            </span>{" "}
            <span className="text-gray-500">({task.assignedTo?.email})</span>
          </p>
        </div>

        {/* Divider */}

        <div className="my-6 border-t border-white/10"></div>

        {/* Description */}

        <div>
          <h2 className="font-semibold text-gray-200">Description</h2>

          <p className="text-gray-400 mt-2 whitespace-pre-line leading-relaxed">
            {task.description}
          </p>
        </div>

        {/* Status */}

        <div className="flex flex-wrap gap-3 mt-6">
          <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 capitalize">
            {task.status?.replace("-", " ")}
          </span>

          <span
            className={`px-3 py-1 text-xs rounded-full border capitalize
            ${
              task.priority === "high"
                ? "bg-red-500/20 text-red-400 border-red-500/30"
                : task.priority === "medium"
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  : "bg-gray-500/20 text-gray-400 border-gray-500/30"
            }`}
          >
            {task.priority}
          </span>
        </div>
      </div>

      {/* CHAT */}

      <div className="mt-6">
        <ChatButton
          conversationId={id}
          conversationType={"task"}
          Name={task.title}
          members={[task.assignedTo, task.createdBy]}
        />
      </div>

      {/* TABS */}

      <div className="max-w-3xl mx-auto mt-8">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("discussion")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeTab === "discussion"
                ? "bg-purple-500/20 text-white border border-purple-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <MessageSquare size={18} />
            Discussion
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeTab === "timeline"
                ? "bg-purple-500/20 text-white border border-purple-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Activity size={18} />
            Timeline
          </button>
        </div>
      </div>

      {/* DISCUSSION */}

      {activeTab === "discussion" && (
        <div className="max-w-3xl mx-auto mt-6">
          {/* Input */}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              placeholder="Write a comment..."
              className="w-full bg-transparent outline-none resize-none text-sm text-white placeholder:text-gray-500"
            />

            <div className="flex justify-end mt-3">
              <button
                onClick={handleCreateComment}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 transition"
              >
                Send
              </button>
            </div>
          </div>

          {/* Comments */}

          <div className="space-y-4 mt-6">
            {comments.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No comments yet
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4"
                >
                  <div className="flex justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {comment.userId?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-white">
                          {comment.userId?.name}
                        </h4>

                        <p className="text-sm text-gray-400 mt-1 whitespace-pre-line">
                          {comment.message}
                        </p>

                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* DELETE */}

                    {comment.userId?.email === user?.email && (
                      <button
                        onClick={() => {
                          setDeletingCommentId(comment._id);

                          setIsDeleteOpen(true);
                        }}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TIMELINE */}

      {activeTab === "timeline" && (
        <div className="max-w-3xl mx-auto mt-6 mb-10">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            {/* Header */}

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-white">Timeline</h2>

              <span className="text-sm text-gray-400">
                {taskActivities.length} events
              </span>
            </div>

            {/* Loading */}

            {activitiesLoading ? (
              <div className="text-center py-10 text-gray-500">
                Loading timeline...
              </div>
            ) : taskActivities.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No timeline activity yet
              </div>
            ) : (
              <div className="relative">
                {/* Line */}

                <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/10" />

                <div className="space-y-8">
                  {taskActivities.map((activity) => (
                    <div key={activity._id} className="relative flex gap-4">
                      {/* Avatar */}

                      <div className="relative z-10 w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shrink-0 shadow-lg shadow-purple-500/20">
                        {activity.userId?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>

                      {/* Content */}

                      <div className="flex-1 min-w-0">
                        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 hover:bg-white/[0.05] transition-all duration-300">
                          <p className="text-sm text-gray-200 leading-relaxed">
                            {activity.message}
                          </p>

                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* UPDATE MODAL */}

      {isUpdateOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsUpdateOpen(false)}
          />

          <div className="relative bg-[#0b0b17] border border-white/10 rounded-2xl shadow-lg p-6 w-full max-w-md z-10 max-h-[95vh] overflow-y-auto">
            <button
              onClick={() => setIsUpdateOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
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

      {/* DELETE COMMENT MODAL */}

      <ConfirmDeleteComment
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteComment}
      />
    </div>
  );
};

export default TaskDetails;
