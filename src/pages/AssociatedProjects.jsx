// src/components/AssociatedProjects.jsx

import { useEffect, useState } from "react";
import { getAssociatedProjects } from "../services/projectService";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";

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
        if (err.response?.data?.message === "Unathorized access") {
          setError(err.response?.data?.message || "Failed to fetch projects");
        } else {
          setError("Failed to fetch projects");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#070710] text-gray-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>
          <p className="text-lg">Loading associated projects...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#070710] px-6">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-5 rounded-2xl text-center max-w-md">
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070710] text-white px-6 py-10">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center shadow-lg shadow-purple-500/10">
          <FolderKanban className="w-7 h-7 text-purple-400" />
        </div>

        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Associated Projects
          </h2>

          <p className="text-gray-400 mt-1">
            Projects where you're collaborating with other members.
          </p>
        </div>
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="relative overflow-hidden border border-white/10 bg-[#0b0b17] rounded-3xl p-10 text-center">
          
          {/* Glow */}
          <div className="absolute -top-20 -right-20 w-52 h-52 bg-purple-500/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-pink-500/10 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
              <Sparkles className="w-10 h-10 text-purple-400" />
            </div>

            <h3 className="text-2xl font-semibold mb-2">
              No Associated Projects
            </h3>

            <p className="text-gray-400 max-w-md">
              You are not a member of any projects created by other users yet.
            </p>
          </div>
        </div>
      ) : (
        
        /* Project Grid */
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link
              to={`/project/${project._id}`}
              key={project._id}
              className="group"
            >
              <div className="relative overflow-hidden h-full rounded-3xl border border-white/10 bg-[#0b0b17] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10">
                
                {/* Glow Effects */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition duration-500" />

                <div className="relative z-10">
                  
                  {/* Top Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 flex items-center justify-center mb-5">
                    <FolderKanban className="w-7 h-7 text-purple-400" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white line-clamp-1">
                    {project.title}
                  </h3>

                  {/* Creator */}
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>
                      Created by{" "}
                      <span className="text-gray-200 font-medium">
                        {project.createdBy?.name || "Unknown"}
                      </span>
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 mt-4 line-clamp-3 leading-relaxed">
                    {project.description || "No description provided"}
                  </p>

                  {/* Bottom Action */}
                  <div className="flex items-center gap-2 mt-6 text-purple-400 font-medium group-hover:translate-x-1 transition-transform duration-300">
                    <span>Open Project</span>
                    <ArrowRight className="w-4 h-4" />
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

export default AssociatedProjects;













// // src/components/AssociatedProjects.jsx
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { getAssociatedProjects } from "../services/projectService";
// import { Link } from "react-router-dom";

// const AssociatedProjects = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await getAssociatedProjects();
//         setProjects(res || []);
//       } catch (err) {
//         if(err.response.data.message === 'Unathorized access'){
//         setError(err.response?.data?.message || "Failed to fetch projects");
//         } else {
//           setError("Failed to fetch projects")
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   if (loading) {
//     return (
//       <div className="p-6 text-center">Loading associated projects...</div>
//     );
//   }

//   if (error) {
//     return <div className="p-6 text-center text-red-600">{error}</div>;
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold text-blue-700 mb-4">
//         Associated Projects
//       </h2>

//       {projects.length === 0 ? (
//         <p className="text-gray-600">
//           You are not a member of any projects created by others.
//         </p>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {projects.map((project) => (
//             <Link to={`/project/${project._id}`} className="block" key={project._id}>
//               <div
//                 key={project._id}
//                 className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
//               >
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   {project.title}
//                 </h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Created by:{" "}
//                   <span className="font-medium">
//                     {project.createdBy?.name || "Unknown"}
//                   </span>
//                 </p>
//                 <p className="text-sm text-gray-500 mt-2">
//                   {project.description || "No description"}
//                 </p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssociatedProjects;
