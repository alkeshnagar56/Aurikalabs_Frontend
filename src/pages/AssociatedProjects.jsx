// src/components/AssociatedProjects.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { getAssociatedProjects } from "../services/projectService";
import { Link } from "react-router-dom";

const AssociatedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getAssociatedProjects();
        setProjects(res || []);
      } catch (err) {
        if(err.response.data.message === 'Unathorized access'){
        setError(err.response?.data?.message || "Failed to fetch projects");
        } else {
          setError("Failed to fetch projects")
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">Loading associated projects...</div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Associated Projects
      </h2>

      {projects.length === 0 ? (
        <p className="text-gray-600">
          You are not a member of any projects created by others.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link to={`/project/${project._id}`} className="block" key={project._id}>
              <div
                key={project._id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Created by:{" "}
                  <span className="font-medium">
                    {project.createdBy?.name || "Unknown"}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {project.description || "No description"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssociatedProjects;
