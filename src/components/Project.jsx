// Project component have everything related to displaying projects and creating new ones and linking to everything

import React, { useEffect, useState } from "react";
import { Trash } from "lucide-react";
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
        prevProjects.filter((project) => project._id !== selectedProjectId)
      );
      setIsDeleteModalOpen(false);
      showSuccess("Project deleted")
      setSelectedProjectId(null);
    } catch (error) {
      console.error("Error deleting project:", error);
      showError("Failed to delete project. Please try again.");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          + Create
        </button>
      </div>

{/* Projects Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-[#e3f2fd] to-white text-gray-800 w-1[100%] p-4 rounded-2xl">
  {projects.length === 0 ? (
    <p className="text-gray-500 col-span-2 text-center py-10">
      No projects yet. Click <span className="font-semibold">+ Create</span> to start one.
    </p>
  ) : (
    projects.map((project) => (
      <div
        key={project._id}
        className="relative p-6 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 border border-gray-200"
      >
        {/* Delete Button */}
        <button
          type="button"
          onClick={() => {
            setSelectedProjectId(project._id);
            setIsDeleteModalOpen(true);
          }}
          className="absolute top-3 right-3 p-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 transition"
          title="Delete Project"
          aria-label="Delete Project"
        >
          <Trash size={18} />
        </button>

        {/* Project Card */}
        <Link to={`/project/${project._id}`} className="block">
          <h2 className="text-xl font-semibold text-gray-900">
            {project.title}
          </h2>
          <p className="text-gray-600 mt-2">{project.description}</p>
        </Link>
      </div>
    ))
  )}
</div>


      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            // className="absolute inset-0 bg-gray-500 opacity-50 backdrop-blur-sm"
            className="absolute inset-0 bg-black opacity-30 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md z-10">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {/* Render CreateProject component */}
            <CreateProject
              onClose={() => setIsModalOpen(false)}
              onProjectCreated={(updatedProject) => {
                setProjects((prevprojects) => [
                  updatedProject,
                  ...prevprojects,
                ]); // update members list
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-30 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-md z-10">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <ConfirmDelete
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handleDeleteProject}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
