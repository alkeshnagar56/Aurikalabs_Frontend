import React from "react";
import { Trash2, AlertTriangle } from "lucide-react";

const ConfirmTaskDelete = ({ onClose, onConfirm }) => {
  return (
    <div className="text-white">
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
        <AlertTriangle className="w-7 h-7 text-red-400" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">
        Delete Task
      </h2>

      {/* Description */}
      <p className="text-gray-300 leading-relaxed mb-6">
        Are you sure you want to delete this task?
        <span className="block mt-2 text-red-400 font-medium">
          This action cannot be undone.
        </span>
      </p>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ConfirmTaskDelete;













// import React from "react";

// const ConfirmTaskDelete = ({ onClose, onConfirm }) => {
//   return (
//     <div className="p-6 w-full max-w-md z-10">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">
//         Delete Task
//       </h2>
//       <p className="text-gray-600 mb-6">
//         Are you sure you want to delete this task?
//         <span className="font-semibold text-red-600"> This action cannot be undone.</span>
//       </p>

//       <div className="flex justify-end gap-3">
//         <button
//           onClick={onClose}
//           className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={onConfirm}
//           className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ConfirmTaskDelete;
