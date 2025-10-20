import { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function MessageInput({ onSendMessage, onTyping }) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Handle typing indicator logic
  useEffect(() => {
    if (message && !isTyping) {
      setIsTyping(true);
      onTyping && onTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout for 2 seconds after last keystroke
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTyping && onTyping(false);
      }
    }, 2000);

    // Clean up on component unmount
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping, onTyping]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-end space-x-2">
        <div className="flex-grow relative">
          <textarea
            className="w-full border border-gray-300 rounded-xl py-3 px-4 pr-10 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px] max-h-[120px]"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ overflow: "auto" }}
          />
        </div>
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className={`p-3 mb-3 rounded-full ${
            message.trim()
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          } transition-colors`}
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
