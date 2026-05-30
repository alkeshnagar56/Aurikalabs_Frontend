const ConfirmDeleteComment = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Overlay */}

      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0b17] p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white">Delete Comment</h2>

        <p className="text-sm text-gray-400 mt-3 leading-relaxed">
          Are you sure you want to delete this comment? This action cannot be
          undone.
        </p>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteComment;
