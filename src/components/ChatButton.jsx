import React from "react";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChatButton = ({ conversationId, conversationType, Name, members }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat/${conversationType}/${conversationId}`, {
      state: {
        Name,
        members,
      },
    });
  };
  return (
    <button
      onClick={handleClick}
      className="group fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_10px_40px_rgba(139,92,246,0.4)] hover:scale-110 hover:shadow-[0_15px_50px_rgba(168,85,247,0.5)] transition-all duration-300"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-40 group-hover:opacity-70 transition duration-300"></div>

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center">
        <MessageSquare className="w-5 h-5 mb-[2px]" />
        <span className="text-[11px] font-semibold tracking-wide">Chat</span>
      </div>
    </button>
  );
  //   return (
  //   <button
  //     onClick={handleClick}
  //     className="
  //       fixed bottom-6 right-6 z-50
  //       group
  //       flex items-center justify-center
  //       w-16 h-16
  //       rounded-2xl
  //       bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
  //       shadow-[0_10px_40px_rgba(139,92,246,0.45)]
  //       hover:scale-110
  //       hover:shadow-[0_15px_50px_rgba(168,85,247,0.6)]
  //       active:scale-95
  //       transition-all duration-300
  //       border border-white/10
  //       backdrop-blur-md
  //     "
  //     aria-label="Open Chat"
  //   >
  //     {/* Glow Effect */}
  //     <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition duration-300"></div>

  //     {/* Content */}
  //     <div className="relative flex flex-col items-center justify-center">
  //       <MessageSquare className="w-6 h-6 text-white drop-shadow-md" />

  //       <span className="text-[11px] font-semibold tracking-wide text-white mt-1">
  //         Chat
  //       </span>
  //     </div>
  //   </button>
  // );

  // return (
  //   <button
  //     className="text-center flex justify-center flex-col fixed bottom-5 right-5 w-16 h-16 bg-blue-400 text-white rounded-full shadow-lg hover:bg-blue-500 transition"
  //     onClick={handleClick}
  //   >
  //     <div className="flex justify-center">
  //       <MessageSquare className="r-2 w-4 h-4" />
  //     </div>
  //     <span className="font-bold text-sm text-white">Chat</span>
  //   </button>
  // );
};

export default ChatButton;
