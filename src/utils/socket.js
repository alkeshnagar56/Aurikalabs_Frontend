// src/utils/socket.js
import { io } from "socket.io-client";

// comment below url line to deploy and uncomment next line
// const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://aurikalabs-backend.onrender.com";


let socket = null;

/**
 * Returns a singleton socket instance
 */
export function getSocket() {
    console.log(SOCKET_URL);

    if (!socket) {
        socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ["websocket", "polling"]
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
