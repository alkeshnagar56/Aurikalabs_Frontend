// Project component have everything related to displaying projects and creating new ones and linking to everything

import React, { useEffect, useState } from "react";
import {
  Trash,
  FolderKanban,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { deleteProject, fetchProjects } from "../services/projectService";
import { Link } from "react-router-dom";

import CreateProject from "../models/CreateProject";
import ConfirmDelete from "../models/ConfirmDelete";

import { showError, showSuccess } from "../utils/toastStyles";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects([...data].reverse());
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      }
    };

    getProjects();
  }, []);

  const handleDeleteProject = async () => {
    if (!selectedProjectId) return;

    try {
      await deleteProject(selectedProjectId);

      setProjects((prevProjects) =>
        prevProjects.filter(
          (project) => project._id !== selectedProjectId,
        ),
      );

      setIsDeleteModalOpen(false);
      setSelectedProjectId(null);

      showSuccess("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      showError("Failed to delete project. Please try again.");
    }
  };

  return (
    <div className="relative">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-purple-300 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Workspace Projects
            </div>

            <h1 className="text-3xl font-bold text-white">
              Your Projects
            </h1>

            <p className="text-gray-400 mt-2">
              Organize ideas, manage tasks, and collaborate with your team.
            </p>
          </div>

          {/* Create Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg shadow-purple-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
          >
            <span>Create Project</span>

            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              +
            </div>
          </button>
        </div>

        {/* Empty State */}
        {projects.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-12 text-center shadow-2xl">
            {/* Glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-purple-500/10 blur-[120px]" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center mb-6">
                <FolderKanban className="w-10 h-10 text-purple-300" />
              </div>

              <h2 className="text-2xl font-semibold text-white mb-3">
                No projects yet
              </h2>

              <p className="text-gray-400 max-w-md leading-relaxed">
                Start building your workflow by creating your first project.
                Manage tasks, collaborate with members, and stay productive.
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-8 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-purple-500/20"
              >
                Create Your First Project
              </button>
            </div>
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-[1px] hover:border-purple-500/20 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient Hover Layer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />

                {/* Card */}
                <div className="relative h-full rounded-3xl bg-[#0b0b17]/95 p-6 overflow-hidden">
                  {/* Glow */}
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition duration-500" />

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProjectId(project._id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:scale-110 transition-all duration-200 opacity-70 group-hover:opacity-100"
                    title="Delete Project"
                  >
                    <Trash size={16} />
                  </button>

                  {/* Content */}
                  <Link
                    to={`/project/${project._id}`}
                    className="relative z-10 block h-full"
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center shrink-0">
                          <FolderKanban className="w-7 h-7 text-purple-300" />
                        </div>

                        <div>
                          <h2 className="text-xl font-semibold text-white line-clamp-1">
                            {project.title}
                          </h2>

                          <p className="text-xs text-gray-500 mt-1">
                            Project #{index + 1}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed line-clamp-3 min-h-[72px]">
                      {project.description ||
                        "No description added for this project yet."}
                    </p>

                    {/* Footer */}
                    <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Active Workspace
                      </div>

                      <div className="flex items-center gap-2 text-sm font-medium text-purple-300 group-hover:text-pink-300 transition">
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
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Wrapper */}
          <div className="relative w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
            {/* Inner */}
            <div className="relative bg-[#0b0b17] rounded-3xl border border-white/10 p-1">
              {/* Close */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition z-20"
              >
                ✕
              </button>

              <CreateProject
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={(updatedProject) => {
                  setProjects((prevProjects) => [
                    updatedProject,
                    ...prevProjects,
                  ]);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setIsDeleteModalOpen(false)}
          />

          {/* Wrapper */}
          <div className="relative w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-br from-red-500/30 via-pink-500/20 to-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.15)]">
            {/* Inner */}
            <div className="relative bg-[#0b0b17] rounded-3xl border border-red-500/10 p-1">
              {/* Close */}
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition z-20"
              >
                ✕
              </button>

              <ConfirmDelete
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteProject}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;