"use client";

import { useState, useEffect } from "react";
import {
  SparklesIcon,
  PaperAirplaneIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { aiConversations, mockTeacherData } from "@/app/lib/api/teacherService";

export default function TeacherAIConversations() {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [newConversationTitle, setNewConversationTitle] = useState("");

  // Mock data for development
  const mockConversations = [
    {
      id: "conv_001",
      title: "Student Progress Analysis",
      lastMessage: "How can I improve John's calculus performance?",
      timestamp: "2024-01-20T10:30:00Z",
      messageCount: 5,
    },
    {
      id: "conv_002",
      title: "Assignment Strategy",
      lastMessage: "What's the best way to assign tutors to students?",
      timestamp: "2024-01-19T15:45:00Z",
      messageCount: 3,
    },
    {
      id: "conv_003",
      title: "Parent Communication",
      lastMessage: "How should I communicate progress to parents?",
      timestamp: "2024-01-18T09:20:00Z",
      messageCount: 7,
    },
  ];

  const mockMessages = [
    {
      id: "msg_001",
      role: "user",
      content:
        "I have a student who is struggling with calculus. What strategies can I recommend to help them improve?",
      timestamp: "2024-01-20T10:30:00Z",
    },
    {
      id: "msg_002",
      role: "assistant",
      content:
        "I'd be happy to help you develop strategies for your calculus student. Here are some evidence-based approaches:\n\n1. **Diagnostic Assessment**: First, identify specific areas of weakness through targeted assessments\n2. **Visual Learning**: Use graphs, diagrams, and visual representations of concepts\n3. **Step-by-Step Breakdown**: Break complex problems into smaller, manageable steps\n4. **Practice with Feedback**: Provide immediate feedback on practice problems\n5. **Real-world Applications**: Connect calculus concepts to practical examples\n\nWould you like me to elaborate on any of these strategies or discuss specific challenges your student is facing?",
      timestamp: "2024-01-20T10:31:00Z",
    },
    {
      id: "msg_003",
      role: "user",
      content:
        "The student specifically struggles with integration techniques. They understand the concept but make errors in the algebraic manipulation.",
      timestamp: "2024-01-20T10:35:00Z",
    },
    {
      id: "msg_004",
      role: "assistant",
      content:
        "That's a common issue with integration! Here are targeted strategies for algebraic manipulation errors:\n\n**Common Error Patterns to Address:**\n- Sign errors when distributing\n- Incorrect application of power rules\n- Mistakes in substitution steps\n- Forgetting to add the constant of integration\n\n**Specific Interventions:**\n1. **Error Analysis**: Have the student identify their own mistakes\n2. **Scaffolded Practice**: Start with simpler problems and gradually increase complexity\n3. **Checkpoint Method**: Stop at each step to verify before proceeding\n4. **Peer Review**: Pair with another student to check each other's work\n5. **Technology Integration**: Use graphing calculators to verify results\n\nWould you like specific practice problems or worksheets I can recommend?",
      timestamp: "2024-01-20T10:36:00Z",
    },
  ];

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await aiConversations.getAll();
      setConversations(response.data.conversations || []);
    } catch (err) {
      console.log("Using mock data for development");
      // Fallback to mock data
      setConversations(mockTeacherData.aiConversations || mockConversations);
    } finally {
      setLoading(false);
    }
  };

  const createNewConversation = async () => {
    if (!newConversationTitle.trim()) return;

    try {
      const response = await aiConversations.create(newConversationTitle);
      const newConv = response.data.conversation;

      setConversations((prev) => [newConv, ...prev]);
      setCurrentConversation(newConv);
      setNewConversationTitle("");
    } catch (err) {
      console.log("Using mock data for development");
      // Fallback: create locally
      const newConv = {
        id: `conv_${Date.now()}`,
        title: newConversationTitle,
        lastMessage: "New conversation started",
        timestamp: new Date().toISOString(),
        messageCount: 0,
      };

      setConversations((prev) => [newConv, ...prev]);
      setCurrentConversation(newConv);
      setNewConversationTitle("");
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentConversation) return;

    try {
      setSending(true);

      // Add user message locally first
      const userMessage = {
        id: `msg_${Date.now()}`,
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };

      // Send to API
      const response = await aiConversations.sendMessage(
        currentConversation.id,
        message
      );

      // Add AI response
      const aiMessage = response.data.message;

      setMessage("");
      setSending(false);
    } catch (err) {
      console.log("Using mock data for development");
      // Fallback: simulate AI response
      setTimeout(() => {
        const aiMessage = {
          id: `msg_${Date.now() + 1}`,
          role: "assistant",
          content:
            "I understand your question about teaching strategies. Let me provide some helpful insights based on educational best practices...",
          timestamp: new Date().toISOString(),
        };

        setSending(false);
      }, 2000);

      setMessage("");
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      await aiConversations.delete(conversationId);
      setConversations((prev) =>
        prev.filter((conv) => conv.id !== conversationId)
      );
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
      }
    } catch (err) {
      console.log("Using mock data for development");
      // Fallback: delete locally
      setConversations((prev) =>
        prev.filter((conv) => conv.id !== conversationId)
      );
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              AI Conversations
            </h1>
            <p className="text-gray-600">
              Get AI-powered insights and recommendations for your teaching
            </p>
          </div>
          <button
            onClick={() => setNewConversationTitle("New Conversation")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Conversation
          </button>
        </div>
      </div>

      <div className="flex-1 flex bg-white shadow rounded-lg overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* New Conversation Form */}
          {newConversationTitle && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="space-y-3">
                <input
                  type="text"
                  value={newConversationTitle}
                  onChange={(e) => setNewConversationTitle(e.target.value)}
                  placeholder="Conversation title..."
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onKeyPress={(e) =>
                    e.key === "Enter" && createNewConversation()
                  }
                />
                <div className="flex space-x-2">
                  <button
                    onClick={createNewConversation}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setNewConversationTitle("")}
                    className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setCurrentConversation(conversation)}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  currentConversation?.id === conversation.id
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-400">
                        {new Date(conversation.timestamp).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-400">
                        {conversation.messageCount} messages
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <SparklesIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {currentConversation.title}
                    </h3>
                    <p className="text-xs text-gray-500">AI Assistant</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-3xl ${
                        msg.role === "user" ? "ml-12" : "mr-12"
                      }`}
                    >
                      <div
                        className={`flex items-start space-x-3 ${
                          msg.role === "user"
                            ? "flex-row-reverse space-x-reverse"
                            : ""
                        }`}
                      >
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            msg.role === "user" ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <UserIcon className="h-5 w-5 text-white" />
                          ) : (
                            <SparklesIcon className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm">
                            {msg.content}
                          </div>
                          <p
                            className={`text-xs mt-1 ${
                              msg.role === "user"
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {sending && (
                  <div className="flex justify-start">
                    <div className="max-w-3xl mr-12">
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <SparklesIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={sendMessage} className="flex space-x-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask AI about teaching strategies, student progress, or assignments..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || sending}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <PaperAirplaneIcon className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No conversation selected
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start a new conversation or select an existing one to chat
                  with AI
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
