import React from "react";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChatButton = ({ conversationId, conversationType }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat/${conversationType}/${conversationId}`);
  };

  return (
    <button
      className="text-center flex justify-center flex-col fixed bottom-5 right-5 w-16 h-16 bg-blue-400 text-white rounded-full shadow-lg hover:bg-blue-500 transition"
      onClick={handleClick}
    >
      <div className="flex justify-center">
        <MessageSquare className="r-2 w-4 h-4" />
      </div>
      <span className="font-bold text-sm text-white">Chat</span>
    </button>
  );
};

export default ChatButton;
