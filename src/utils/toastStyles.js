import { toast } from "react-hot-toast";

// Shared base style
const baseStyle = {
  borderRadius: "14px",
  padding: "14px 18px",
  color: "#fff",
  fontWeight: "500",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
};

// Success Toast
export const showSuccess = (message) =>
  toast.success(message, {
    duration: 3000,
    style: {
      ...baseStyle,
      background:
        "linear-gradient(135deg, rgba(139,92,246,0.95), rgba(236,72,153,0.9))",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#8B5CF6",
    },
  });

// Error Toast
export const showError = (message) =>
  toast.error(message, {
    duration: 3500,
    style: {
      ...baseStyle,
      background:
        "linear-gradient(135deg, rgba(239,68,68,0.95), rgba(127,29,29,0.92))",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#EF4444",
    },
  });