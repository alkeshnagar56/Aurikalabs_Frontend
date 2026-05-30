// src/components/ChatRoom.jsx

import React, { useEffect, useRef, useState, useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import { getMessages } from "../services/chatServices";

import {
  useParams,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { getSocket } from "../utils/socket";

import {
  Check,
  CheckCheck,
  Users,
  ChevronDown,
  SendHorizonal,
  ArrowLeft,
} from "lucide-react";

const ChatRoom = () => {
  const { conversationType, conversationId } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);

  const [text, setText] = useState("");

  const [typingUsers, setTypingUsers] = useState({});

  const [loading, setLoading] = useState(true);

  const [showMembers, setShowMembers] = useState(false);

  const listRef = useRef();

  // Props passed through navigate state
  const Name = location.state?.Name || "Conversation";

  const members = location.state?.members || [];

  const socket = getSocket();

  // Remove duplicate members
  const uniqueMembers = Array.from(
    new Map(
      members?.filter((m) => m?._id).map((m) => [m._id, m]),
    ).values(),
  );

  // Load messages
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMessages(
          conversationType,
          conversationId,
        );

        if (res) {
          setMessages(res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) load();
  }, [conversationId, conversationType]);

  // Socket setup
  useEffect(() => {
    if (!conversationId || !user) return;

    socket.emit("join", { conversationId });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);

      scrollToBottom();
    });

    socket.on("typing", ({ userId, isTyping }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [userId]: isTyping,
      }));
    });

    socket.on("messagesRead", ({ messageIds }) => {
      setMessages((prev) =>
        prev.map((m) =>
          messageIds.includes(m._id)
            ? { ...m, status: "read" }
            : m,
        ),
      );
    });

    return () => {
      socket.emit("leave", { conversationId });

      socket.off("message");

      socket.off("typing");

      socket.off("messagesRead");
    };
  }, [conversationId, user]);

  // Scroll helper
  const scrollToBottom = () => {
    setTimeout(() => {
      listRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 50);
  };

  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  }, [loading]);

  // Send message
  const handleSend = () => {
    if (!text.trim()) return;

    const payload = {
      conversationType,
      conversationId,
      text,
    };

    socket.emit("sendMessage", payload, (ack) => {
      if (!ack?.success) {
        console.error("Message send failed");
      }
    });

    setText("");

    socket.emit("typing", {
      conversationId,
      isTyping: false,
    });
  };

  // Typing count
  const typingCount = Object.keys(typingUsers).filter(
    (k) => typingUsers[k] && k !== user?.id,
  ).length;

  return (
    <div className="relative flex flex-col h-screen bg-[#070710] text-white overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute w-[350px] h-[350px] bg-purple-600/10 blur-[140px] top-[-120px] left-[-120px]" />

      <div className="absolute w-[300px] h-[300px] bg-pink-500/10 blur-[140px] bottom-[-120px] right-[-120px]" />

      <div className="absolute w-[220px] h-[220px] bg-blue-500/5 blur-[120px] top-[35%] left-[45%]" />

      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-2xl bg-[#0b0b17]/80">
        
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          
          {/* Left */}
          <div className="flex items-center gap-3">
            
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>

            {/* Chat Info */}
            <div className="relative">
              <button
                onClick={() =>
                  setShowMembers((prev) => !prev)
                }
                className="flex items-center gap-3 group"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Users className="w-5 h-5 text-white" />
                </div>

                <div className="text-left">
                  <h1 className="text-base md:text-lg font-semibold text-white group-hover:text-purple-300 transition">
                    {Name}
                  </h1>

                  <p className="text-xs text-gray-400">
                    {conversationType === "project"
                      ? `${uniqueMembers.length} Members`
                      : "Direct Task Chat"}
                  </p>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition ${
                    showMembers ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Members Dropdown */}
              {showMembers && (
                <div className="absolute top-16 left-0 w-72 bg-[#0b0b17]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-4 z-50">
                  
                  <h2 className="text-sm font-semibold text-purple-300 mb-3">
                    Participants
                  </h2>

                  <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
                    {uniqueMembers.length > 0 ? (
                      uniqueMembers.map((member) => (
                        <div
                          key={member._id}
                          className="flex items-center gap-3 bg-white/[0.04] backdrop-blur-xl rounded-xl p-3 hover:bg-white/[0.07] transition"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                            {member?.name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {member.name}
                            </p>

                            <p className="text-xs text-gray-400 truncate">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">
                        No members found
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-transparent scrollbar-hide">
        
        {loading && (
          <div className="text-center text-gray-400">
            Loading messages...
          </div>
        )}

        {messages.map((m) => {
          const isMine =
            m.sender.email === user?.email;

          return (
            <div
              key={m._id}
              className={`flex ${
                isMine
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-xl border backdrop-blur-xl ${
                  isMine
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400/20"
                    : "bg-white/[0.04] border-white/10"
                }`}
              >
                {!isMine && (
                  <p className="text-xs font-semibold text-purple-300 mb-1">
                    {m.sender.name}
                  </p>
                )}

                <p className="text-sm leading-relaxed break-words text-gray-100">
                  {m.text}
                </p>

                <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-gray-300">
                  {new Date(
                    m.createdAt,
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}

                  {isMine &&
                    (m.status === "read" ? (
                      <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-gray-300" />
                    ))}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={listRef} />
      </div>

      {/* Typing */}
      {typingCount > 0 && (
        <div className="px-5 py-1 text-xs text-purple-300 bg-[#0b0b17]/80 backdrop-blur-xl border-t border-white/5">
          {typingCount}{" "}
          {typingCount === 1
            ? "person is"
            : "people are"}{" "}
          typing...
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-0 border-t border-white/10 bg-[#0b0b17]/80 backdrop-blur-2xl p-4">
        
        <div className="flex items-center gap-3 max-w-5xl mx-auto">
          
          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value);

              socket.emit("typing", {
                conversationId,
                isTyping:
                  e.target.value.length > 0,
              });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-xl"
            placeholder="Write a message..."
          />

          <button
            onClick={handleSend}
            className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center hover:scale-105 transition shadow-lg shadow-purple-500/20"
          >
            <SendHorizonal className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;