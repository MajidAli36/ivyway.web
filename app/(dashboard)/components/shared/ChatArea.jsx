import { useRef, useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import SessionBanner from "./SessionBanner";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import EmptyState from "./EmptyState";
import { messaging } from "@/app/lib/api/messaging";

export default function ChatArea({
  selectedConversation,
  messages = [],
  isMobileView,
  showMobileChat,
  onBackToList,
  onSendMessage,
  onTyping,
  loading = false,
  userRole = "student", // "student" or "tutor"
  onMessageDeleted,
}) {
  // Ref for scrolling to bottom of messages
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [deletingMessageIds, setDeletingMessageIds] = useState(new Set());

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      // Use scrollTop instead of scrollIntoView to prevent layout shifts
      const scrollContainer = messagesContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  // Handler for deleting messages
  // Modify the handleDeleteMessage function

  const handleDeleteMessage = async (messageId) => {
    if (!messageId) {
      console.error("Invalid message ID for deletion");
      return;
    }

    try {
      // Add message ID to deleting set to show loading state
      setDeletingMessageIds((prev) => new Set([...prev, messageId]));

      // Find the message to check if it's from the current user
      const messageToDelete = messages.find((m) => m.id === messageId);

      // We'll still attempt to delete even if message is not found locally
      // as it might exist on the server
      if (messageToDelete) {
        // Check if this is the user's own message
        const isOwnMessage =
          messageToDelete.sender === userRole ||
          (messageToDelete.sender === "student" && userRole === "student") ||
          (messageToDelete.sender === "tutor" && userRole === "tutor");

        if (!isOwnMessage) {
          console.warn("You can only delete your own messages");
          return;
        }
      }

      // Call the API to delete the message
      // Note: We simplified the API call to only use messageId
      const response = await messaging.deleteMessage(messageId);

      console.log("Message deleted successfully:", messageId);

      // Handle the response based on deletion scope
      if (typeof onMessageDeleted === "function") {
        // Since deletion affects only the deleter's view,
        // always pass true for isLocalDeletion
        onMessageDeleted(messageId, true);
      } else {
        // If no parent handler is provided, update local state
        console.warn("No onMessageDeleted handler provided to ChatArea");
      }
    } catch (error) {
      console.error("Error deleting message:", error.message || error);

      // Special handling for "already deleted" messages
      if (error.message && error.message.includes("already deleted")) {
        console.log(
          "Message already deleted on the server, updating local UI only"
        );

        // If the message is already deleted, we'll just update the UI locally
        if (typeof onMessageDeleted === "function") {
          onMessageDeleted(messageId, true);
        }
      } else {
        // Show an error notification for other types of errors
        // toast.error("Failed to delete message. Please try again.");
      }
    } finally {
      // Remove message ID from deleting set regardless of success/failure
      setDeletingMessageIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  if (!selectedConversation) {
    return <EmptyState />;
  }

  // Determine which role to display in header
  const otherUserRole = userRole === "student" ? "tutor" : "student";

  return (
    <div
      className={`${
        isMobileView && !showMobileChat ? "hidden" : "flex"
      } flex-grow flex flex-col h-full overflow-hidden`}
    >
      {/* Fixed header */}
      <div className="flex-shrink-0">
        <ChatHeader
          user={selectedConversation}
          userRole={otherUserRole}
          isMobileView={isMobileView}
          onBackToList={onBackToList}
        />

        {selectedConversation.upcomingSession && (
          <SessionBanner
            session={selectedConversation.upcomingSession}
            userId={selectedConversation.id}
          />
        )}
      </div>

      {/* Messages area - only this part scrolls */}
      <div
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto p-4 bg-gray-50"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm mt-1">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                userName={selectedConversation?.name || "User"}
                status={msg.sending ? "sending" : msg.error ? "error" : "sent"}
                isDeleting={deletingMessageIds.has(msg.id)}
                onDeleteMessage={handleDeleteMessage}
                currentUserRole={userRole} // Properly pass userRole to each message
              />
            ))}
            {typingIndicator && (
              <div
                className="flex items-center text-gray-500 text-sm"
                id="typing-indicator"
              >
                <div className="bg-gray-200 px-4 py-2 rounded-full">
                  {selectedConversation.name} is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Fixed input area */}
      <div className="flex-shrink-0">
        <MessageInput
          onSendMessage={(message, attachment) =>
            onSendMessage(message, attachment)
          }
          onTyping={onTyping}
        />
      </div>
    </div>
  );
}
