import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getInitials } from "../../utils/helpers";
import MessageBubble from "./MessageBubble";

export default function MessageList({
  conversations,
  searchQuery,
  setSearchQuery,
  selectedConversation,
  onSelectConversation,
  onDeleteConversation = () => {}, // Add default empty function to prevent errors
  loading = false,
  error = null,
  userRole = "student", // Can be "student" or "tutor"
  messages,
  currentUserId,
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef(null);

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conversation.subject &&
        conversation.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const messagesEndRef = useRef(null);
  const [localMessages, setLocalMessages] = useState(messages || []);

  useEffect(() => {
    setLocalMessages(messages || []);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const handleMessageDeleted = (messageId) => {
    setLocalMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId)
    );
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        setContextMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle right click on conversation
  const handleContextMenu = (e, conversation) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      conversation: conversation,
    });
  };

  // Handle delete option click
  const handleDelete = (conversationId) => {
    if (typeof onDeleteConversation === "function") {
      onDeleteConversation(conversationId);
    } else {
      console.error("onDeleteConversation is not a function");
    }
    setContextMenu(null);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Fixed header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Scrollable conversation list */}
      <div className="flex-grow overflow-y-auto">
        {loading ? (
          <div className="text-center p-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-500">Loading conversations...</p>
          </div>
        ) : error ? (
          <div className="text-center p-6 text-red-500">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-blue-500 underline"
            >
              Refresh
            </button>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center p-6 text-gray-500">
            {searchQuery
              ? "No matching conversations found"
              : "No conversations yet"}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredConversations.map((conversation) => (
              <li
                key={conversation.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                  selectedConversation?.id === conversation.id
                    ? "bg-blue-50"
                    : ""
                }`}
                onClick={() => onSelectConversation(conversation)}
                onContextMenu={(e) =>
                  userRole === "tutor"
                    ? handleContextMenu(e, conversation)
                    : null
                }
              >
                <div className="flex items-center px-4 py-4">
                  <div className="relative flex-shrink-0">
                    {conversation.profileImageUrl ? (
                      <img
                        src={conversation.profileImageUrl}
                        alt={conversation.name}
                        className="h-12 w-12 rounded-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold bg-gray-500"
                      style={{ display: conversation.profileImageUrl ? "none" : "flex" }}
                    >
                      {getInitials(conversation.name)}
                    </div>
                    {conversation.online && (
                      <div className="absolute -bottom-0.5 -right-0.5">
                        <div className="h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-grow min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 truncate">
                        {conversation.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-600 truncate max-w-[70%]">
                        {/* Show who sent the last message if available and message is not empty */}
                        {conversation.lastMessage && conversation.lastMessage !== "No messages yet" ? conversation.lastMessage : conversation.lastMessageContent || conversation.lastMessageText || "No messages yet"}
                         
                       
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && userRole === "tutor" && (
        <div
          ref={contextMenuRef}
          className="absolute z-50 bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[150px]"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          <button
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center"
            onClick={() => handleDelete(contextMenu.conversation.id)}
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete Chat
          </button>
        </div>
      )}

      {/* Message bubbles */}
      <div className="flex-1 overflow-y-auto p-4">
        {localMessages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.senderId === currentUserId}
            onMessageDeleted={handleMessageDeleted}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
