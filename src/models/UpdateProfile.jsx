import { useState } from "react";

const UpdateProfile = ({ onClose, user, onUpdate }) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || ""); // optional if editable

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ name, email }); // pass updated data to parent
    onClose();
  };

  return (
    <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Update Profile</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        {/* Keep email field only if you want to make it editable */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            disabled // remove if you want to allow editing
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
