"use client";

import { useState } from "react";
import {
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { SupportChat } from "../../../components/support";

// Dummy data for support tickets
const DUMMY_TICKETS = [
  {
    id: 1,
    title: "Session Booking Issue",
    status: "resolved",
    priority: "high",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    category: "booking",
    description:
      "Unable to book tutoring sessions with students. The system keeps showing an error.",
  },
  {
    id: 2,
    title: "Payment Processing Problem",
    status: "in-progress",
    priority: "medium",
    createdAt: "2024-01-14T15:30:00Z",
    updatedAt: "2024-01-14T16:00:00Z",
    category: "billing",
    description: "Payment processing is not working correctly for my sessions.",
  },
  {
    id: 3,
    title: "Profile Update Not Saving",
    status: "pending",
    priority: "low",
    createdAt: "2024-01-13T09:20:00Z",
    updatedAt: "2024-01-13T09:20:00Z",
    category: "technical",
    description: "Changes to my tutor profile are not being saved.",
  },
  {
    id: 4,
    title: "Student Communication Issue",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-01-12T14:15:00Z",
    updatedAt: "2024-01-12T15:30:00Z",
    category: "communication",
    description:
      "Unable to receive messages from students through the platform.",
  },
];

const DUMMY_FAQS = [
  {
    id: 1,
    question: "How do I set my availability for tutoring sessions?",
    answer:
      "Go to the 'Schedule' section in your dashboard, select your available time slots, and save. Students will be able to book sessions during these times.",
    category: "scheduling",
  },
  {
    id: 2,
    question: "How do I get paid for my tutoring sessions?",
    answer:
      "Earnings are automatically calculated and processed. Go to the 'Earnings' section to view your payment history and upcoming payouts.",
    category: "billing",
  },
  {
    id: 3,
    question: "How do I communicate with students?",
    answer:
      "Use the 'Messages' section to communicate with students. You can also view student requests in the 'Student Requests' section.",
    category: "communication",
  },
  {
    id: 4,
    question: "What if I need to cancel a session?",
    answer:
      "You can cancel sessions up to 24 hours before the scheduled time. Go to 'Sessions' and click 'Cancel' next to the session you want to cancel.",
    category: "sessions",
  },
  {
    id: 5,
    question: "How do I update my tutor profile?",
    answer:
      "Go to the 'Profile' section in your dashboard, click 'Edit Profile', make your changes, and save. Your updated information will be reflected immediately.",
    category: "account",
  },
  {
    id: 6,
    question: "What subjects can I tutor?",
    answer:
      "You can tutor a wide range of subjects. Update your expertise areas in your profile to attract relevant students.",
    category: "subjects",
  },
  {
    id: 7,
    question: "How do I upgrade to Advanced Tutor?",
    answer:
      "Go to the 'Upgrade' section to check your eligibility and apply for Advanced Tutor status. This gives you access to higher rates and more features.",
    category: "upgrade",
  },
];

const CONTACT_OPTIONS = [
  {
    id: 1,
    title: "Live Chat",
    description: "Get instant help from our support team",
    icon: ChatBubbleLeftRightIcon,
    available: true,
    action: "chat",
  },
  {
    id: 2,
    title: "Email Support",
    description: "Send us a detailed message",
    icon: EnvelopeIcon,
    available: true,
    action: "email",
    contact: "support@ivyway.com",
  },
  {
    id: 3,
    title: "Phone Support",
    description: "Speak with a support representative",
    icon: PhoneIcon,
    available: true,
    action: "phone",
    contact: "+1 (555) 123-4567",
  },
  {
    id: 4,
    title: "Knowledge Base",
    description: "Browse our help articles",
    icon: DocumentTextIcon,
    available: true,
    action: "knowledge",
  },
];

export default function TutorSupportPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "text-green-600 bg-green-100";
      case "in-progress":
        return "text-blue-600 bg-blue-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredFAQs = DUMMY_FAQS.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(DUMMY_FAQS.map((faq) => faq.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Support Center
          </h1>
          <p className="text-gray-600">
            Get help with your tutoring account, sessions, payments, and more
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              {
                id: "overview",
                name: "Overview",
                icon: QuestionMarkCircleIcon,
              },
              { id: "tickets", name: "My Tickets", icon: ClockIcon },
              { id: "faq", name: "FAQ", icon: UserGroupIcon },
              {
                id: "contact",
                name: "Contact Us",
                icon: ChatBubbleLeftRightIcon,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CONTACT_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center mb-4">
                    <option.icon className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  {option.contact && (
                    <p className="text-sm text-blue-600 font-medium">
                      {option.contact}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Recent Tickets */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Recent Support Tickets
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {DUMMY_TICKETS.slice(0, 3).map((ticket) => (
                  <div key={ticket.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {ticket.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {ticket.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(ticket.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-gray-50">
                <button
                  onClick={() => setActiveTab("tickets")}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all tickets →
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                My Support Tickets
              </h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                New Ticket
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {DUMMY_TICKETS.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {ticket.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {ticket.category}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                              ticket.status
                            )}`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                              ticket.priority
                            )}`}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(ticket.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "faq" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all"
                        ? "All Categories"
                        : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 mb-3">{faq.answer}</p>
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {faq.category}
                    </span>
                  </div>
                ))}
              </div>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <InformationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No FAQs found matching your search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Contact Support
              </h2>
              <p className="text-gray-600 mb-6">
                Choose the best way to get in touch with our support team.
              </p>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CONTACT_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer min-h-[160px]"
                >
                  <div className="flex items-start">
                    <option.icon className="h-8 w-8 text-blue-600 mt-1" />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {option.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{option.description}</p>
                      {option.contact && (
                        <p className="text-blue-600 font-medium mb-4">
                          {option.contact}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Chat Integration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Live Chat Support
              </h3>
              <p className="text-gray-600 mb-4">
                Get instant help from our support team through live chat.
              </p>
              <div className="h-96 border border-gray-200 rounded-lg">
                <SupportChat userRole="tutor" className="h-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
