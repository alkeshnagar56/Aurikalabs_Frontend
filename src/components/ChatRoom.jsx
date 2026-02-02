// src/components/ChatRoom.jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getMessages } from "../services/chatServices";
import { useParams } from "react-router-dom";
import { getSocket } from "../utils/socket"; // ✅ import socket singleton
import { Check, CheckCheck } from "lucide-react"; // ✅ icons for ticks

const ChatRoom = () => {
  const { conversationType, conversationId } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const listRef = useRef();
  const socket = getSocket(); // ✅ always same instance

  // Load history
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMessages(conversationType, conversationId);
        if (res) setMessages(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (conversationId) load();
  }, [conversationId, conversationType]);

  // Setup socket events
  useEffect(() => {
    if (!conversationId || !user) return;

    socket.emit("join", { conversationId });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socket.on("typing", ({ userId, isTyping }) => {
      setTypingUsers((prev) => ({ ...prev, [userId]: isTyping }));
    });

    socket.on("messagesRead", ({ messageIds }) => {
      setMessages((prev) =>
        prev.map((m) =>
          messageIds.includes(m._id) ? { ...m, status: "read" } : m
        )
      );
    });

    // cleanup listeners when leaving chat
    return () => {
      socket.emit("leave", { conversationId });
      socket.off("message");
      socket.off("typing");
      socket.off("messagesRead");
    };
  }, [conversationId, user, socket]);

  // Scroll to bottom
  const scrollToBottom = () => {
    setTimeout(
      () =>
        listRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }),
      50
    );
  };

  // Scroll after history load
  useEffect(() => {
    if (!loading) scrollToBottom();
  }, [loading]);

  // Send message
  const handleSend = () => {
    if (!text.trim()) return;
    const payload = { conversationType, conversationId, text };
    socket.emit("sendMessage", payload, (ack) => {
      if (!ack?.success) {
        console.error("Message send failed");
      }
    });
    setText("");
  };

  // Count other users typing
  const typingCount = Object.keys(typingUsers).filter(
    (k) => typingUsers[k] && k !== user?.id
  ).length;

  return (
    <div className="flex flex-col h-[92vh] md:h-[89vh] bg-amber-10">
      {/* Messages list */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50 rounded-lg">
        {loading && <p>Loading…</p>}
        {messages.map((m) => {
          const isMine = m.sender.email === user?.email;
          return (
            <div
              key={m._id}
              className={`max-w-[80%] p-3 rounded ${
                isMine
                  ? "ml-auto bg-blue-100"
                  : "bg-gray-100 bg-gradient-to-br from-[#e3f2fd] to-white"
              }`}
            >
              <div className="text-sm font-medium text-gray-700">
                {m.sender.name}
              </div>
              <div className="text-sm">{m.text}</div>
              <div className="flex items-center justify-self-end gap-1 text-xs text-gray-400 mt-1">
                {new Date(m.createdAt).toLocaleString()}
                {isMine &&
                  (m.status === "read" ? (
                    <CheckCheck className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Check className="w-4 h-4 text-gray-400" />
                  ))}
              </div>
            </div>
          );
        })}
        <div ref={listRef} />
      </div>

      {/* Typing indicator */}
      {typingCount > 0 && (
        <div className="px-4 text-sm text-gray-500">
          {typingCount} {typingCount === 1 ? "person is" : "people are"} typing…
        </div>
      )}

      {/* Input box */}
      <div className="sticky bottom-0 w-[100%] md:w-[60%] text-center self-center p-1">
        <div className="flex mt-1 bottom-0">
          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              socket?.emit("typing", {
                conversationId,
                isTyping: e.target.value.length > 0,
              });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="flex-grow px-3 py-2 bg-white border rounded-l-lg focus:outline-none"
            placeholder="Type a message"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
