// src/utils/socket.js
import { io } from "socket.io-client";

// 🔹 Read URL from env (adjust for your setup)
// const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;


let socket = null;

/**
 * Returns a singleton socket instance
 */
export function getSocket() {
    console.log(SOCKET_URL);
    
    if (!socket) {
        socket = io(SOCKET_URL, {
            withCredentials: true,
            auth: {
                // Attach token for backend authentication middleware
                token: localStorage.getItem("token"),
            },
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log("🔌 Connected to socket server:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("❌ Disconnected from socket server");
        });

        socket.on("connect_error", (err) => {
            console.error("⚠️ Socket connection error:", err.message);
        });
    }

    return socket;
}

/**
 * Optional: force close (e.g. on logout)
 */
export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
