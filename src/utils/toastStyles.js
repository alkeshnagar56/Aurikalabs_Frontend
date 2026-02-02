import { toast } from "react-hot-toast";

// notification style for successs and error
export const showSuccess = (message) =>
  toast.success(message, {
    duration: 3000,
    style: { background: "#22C55E", color: "#fff", fontWeight: "bold" }, // green
  });

export const showError = (message) =>
  toast.error(message, {
    duration: 3000,
    style: { background: "#ef4444", color: "#fff", fontWeight: "bold" }, // red
  });
