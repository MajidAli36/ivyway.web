import { useState, useRef } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import ContextMenu from "./ContextMenu";

export default function MessageBubble({
  message,
  userName,
  status = "",
  isDeleting = false,
  onDeleteMessage,
  currentUserRole,
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const messageRef = useRef(null);

  // Determine if this is the current user's message
  const isCurrentUser =
    message.sender === currentUserRole ||
    (message.sender === "student" && currentUserRole === "student") ||
    (message.sender === "tutor" && currentUserRole === "tutor");

  // Styles for message bubbles - update this to handle deleted messages
  const bubbleClasses =
    message.isDeletedLocally || message.isDeleted
      ? "bg-gray-200 text-gray-500 italic rounded-lg"
      : isCurrentUser
      ? "bg-blue-500 text-white rounded-lg rounded-tr-none" // Blue for current user
      : "bg-white text-gray-800 border border-gray-200 rounded-lg rounded-tl-none"; // White for others

  // Container alignment
  const containerClasses = isCurrentUser
    ? "flex justify-end" // Right-aligned for current user
    : "flex justify-start"; // Left-aligned for others

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (message.isDeletedLocally || message.isDeleted) return; // No context menu for already deleted messages

    // Only show context menu for own messages
    if (isCurrentUser) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Only show delete option for own messages
  const contextMenuOptions =
    isCurrentUser && !message.isDeletedLocally && !message.isDeleted
      ? [
          {
            label: "Delete message",
            icon: <TrashIcon className="h-4 w-4" />,
            onClick: () => {
              if (typeof onDeleteMessage === "function") {
                onDeleteMessage(message.id);
              }
              handleCloseContextMenu();
            },
          },
        ]
      : [];

  // Handle regular click to set delete option
  const handleMessageClick = () => {
    // Could implement additional click behavior here
  };

  return (
    <div
      className={`group w-full mb-4 ${isDeleting ? "opacity-50" : ""}`}
      onContextMenu={handleContextMenu}
      onClick={handleMessageClick}
      ref={messageRef}
    >
      <div className={containerClasses}>
        <div className="max-w-[75%] relative flex items-start gap-2">
          {/* Profile image for non-current user messages */}
          {!isCurrentUser &&
            !message.isDeletedLocally &&
            !message.isDeleted &&
            message.profileImageUrl && (
              <div className="flex-shrink-0 mt-1">
                <img
                  src={message.profileImageUrl}
                  alt={userName || "User"}
                  className="h-8 w-8 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          <div className="flex-1">
            {!isCurrentUser &&
              !message.isDeletedLocally &&
              !message.isDeleted && (
                <div className="text-xs text-gray-500 mb-1 ml-2">
                  {userName || "User"}
                </div>
              )}

            <div className={`px-4 py-2 shadow-sm ${bubbleClasses}`}>
              {message.isDeletedLocally || message.isDeleted
                ? "This message has been deleted"
                : message.text || message.content}
            </div>

            {/* Delete icon that shows on hover for own messages - hide for deleted messages */}
            {/* {isCurrentUser && !message.isDeletedLocally && !message.isDeleted && (
              <div className="absolute top-0 right-0 -mr-8 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMessage(message.id);
                  }}
                  className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            )} */}

            <div className="text-xs text-gray-500 mt-1 pl-1">
              {message.timestamp}
              {status === "sending" && " • Sending..."}
              {status === "error" && " • Failed to send"}
            </div>
          </div>
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={contextMenuOptions}
          onClose={handleCloseContextMenu}
        />
      )}
    </div>
  );
}
