"use client";

import { useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  TicketIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/outline";
import ReactAIChat from "../../../components/ai-chat/ReactAIChat";
import SupportTicketList from "../../components/ai-chat/SupportTicketList";

// Dummy conversation data
const DUMMY_CONVERSATIONS = [
  {
    id: 1,
    title: "Help with Math Homework",
    lastMessage: "Can you explain quadratic equations?",
    timestamp: "2024-01-15T10:30:00Z",
    messageCount: 8,
    status: "active",
    userRole: "student",
  },
  {
    id: 2,
    title: "Finding a Tutor for Physics",
    lastMessage: "I need help with Newton's laws",
    timestamp: "2024-01-14T15:20:00Z",
    messageCount: 12,
    status: "completed",
    userRole: "student",
  },
  {
    id: 3,
    title: "Study Schedule Planning",
    lastMessage: "Thanks for the study plan!",
    timestamp: "2024-01-13T09:15:00Z",
    messageCount: 15,
    status: "completed",
    userRole: "student",
  },
  {
    id: 4,
    title: "Chemistry Lab Questions",
    lastMessage: "How do I balance chemical equations?",
    timestamp: "2024-01-12T14:45:00Z",
    messageCount: 6,
    status: "active",
    userRole: "student",
  },
  {
    id: 5,
    title: "Exam Preparation Tips",
    lastMessage: "What's the best way to prepare for finals?",
    timestamp: "2024-01-11T11:30:00Z",
    messageCount: 20,
    status: "completed",
    userRole: "student",
  },
];

export default function StudentAIConversationsPage() {
  const [activeTab, setActiveTab] = useState("chat"); // chat, conversations, tickets

  const tabs = [
    {
      id: "chat",
      name: "AI Chat",
      icon: ChatBubbleLeftRightIcon,
    },
    {
      id: "conversations",
      name: "Conversations",
      icon: ChatBubbleOvalLeftIcon,
    },
    {
      id: "tickets",
      name: "Support Tickets",
      icon: TicketIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Assistant
            </h1>
            <p className="text-gray-600 mt-1">
              Get help with your studies and support
            </p>
          </div>
        </div>

        {/* Modern Tab Navigation */}
        <div className="mt-6">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "chat" && (
          <div className="h-full">
            <ReactAIChat userRole="student" />
          </div>
        )}

        {activeTab === "conversations" && (
          <div className="h-full overflow-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  My Conversations
                </h2>
                <p className="text-gray-600">
                  View and manage your AI chat conversations
                </p>
              </div>

              <div className="grid gap-4">
                {DUMMY_CONVERSATIONS.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {conversation.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              conversation.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {conversation.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <ChatBubbleOvalLeftIcon className="h-4 w-4 mr-1" />
                            {conversation.messageCount} messages
                          </span>
                          <span>
                            {new Date(
                              conversation.timestamp
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Continue Chat
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {DUMMY_CONVERSATIONS.length === 0 && (
                <div className="text-center py-12">
                  <ChatBubbleOvalLeftIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No conversations yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start a new AI chat to see your conversations here
                  </p>
                  <button
                    onClick={() => setActiveTab("chat")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start New Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="h-full overflow-auto p-6">
            <SupportTicketList />
          </div>
        )}
      </div>
    </div>
  );
}
