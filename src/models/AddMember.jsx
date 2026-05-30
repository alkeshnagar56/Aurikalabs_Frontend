import React, { useState } from "react";
import { UserPlus, Mail } from "lucide-react";
import { addMemberToProject } from "../services/projectService";
import { showError, showSuccess } from "../utils/toastStyles";

const AddMember = ({ projectId, onClose, onMemberAdded }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { message, members } = await addMemberToProject(projectId, email);

      setEmail("");

      onMemberAdded(members, message);

      showSuccess("Member added successfully");

      onClose();
    } catch (error) {
      console.error("Error adding member:", error);

      showError(error.response?.data?.message || "Failed to add member");
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#0b0b17] text-white rounded-3xl p-6">
      {/* Glow Effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/10 blur-3xl rounded-full" />

      <div className="relative z-10">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
          <UserPlus className="w-7 h-7 text-purple-400" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Add Member
        </h2>

        <p className="text-gray-400 mb-6">
          Invite a new member to collaborate on this project.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Member Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter member's email"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-purple-500/20"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMember;

// import React, { useState } from "react";
// import { addMemberToProject } from "../services/projectService";
// import { showError, showSuccess } from "../utils/toastStyles";

// const AddMember = ({ projectId, onClose, onMemberAdded }) => {
//   const [email, setEmail] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { message, members } = await addMemberToProject(projectId, email);
//       setEmail(""); // clear input
//       onMemberAdded(members, message); // send updated project to parent
//       showSuccess("Member added ");
//       onClose(); // just close the modal
//     } catch (error) {
//       console.error("Error adding member:", error);
//       showError(error.response?.data?.message || "Failed to add member");
//     }
//   };

//   return (
//     <div className="p-6 w-full max-w-md z-10">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add Member</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-gray-700 mb-1">Member's Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             placeholder="Enter member's email"
//           />
//         </div>
//         <div className="flex justify-end gap-3">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
//           >
//             Add Member
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddMember;
