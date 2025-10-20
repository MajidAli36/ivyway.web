"use client";

import { useState, useEffect } from "react";
import {
  TicketIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { aiChatService } from "../../../lib/api/aiChatService";

export default function SupportTicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Load tickets
  useEffect(() => {
    loadTickets();
  }, [filters]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build clean filter object - only include non-empty values
      const apiFilters = {};
      if (filters.status && filters.status !== "") {
        apiFilters.status = filters.status;
      }
      if (filters.priority && filters.priority !== "") {
        apiFilters.priority = filters.priority;
      }
      if (filters.category && filters.category !== "") {
        apiFilters.category = filters.category;
      }
      apiFilters.limit = 50;

      const response = await aiChatService.getTickets(apiFilters);

      console.log("SupportTicketList API Response:", response);

      if (response?.success) {
        // Safe property access with fallback
        let filteredTickets = response.tickets || response.data?.tickets || [];

        console.log("Filtered tickets:", filteredTickets);

        // Ensure it's an array
        if (!Array.isArray(filteredTickets)) {
          console.warn("Tickets is not an array:", filteredTickets);
          filteredTickets = [];
        }

        // Apply search filter
        if (filters.search) {
          filteredTickets = filteredTickets.filter(
            (ticket) =>
              ticket?.title
                ?.toLowerCase()
                .includes(filters.search.toLowerCase()) ||
              ticket?.description
                ?.toLowerCase()
                .includes(filters.search.toLowerCase()) ||
              ticket?.ticketNumber
                ?.toLowerCase()
                .includes(filters.search.toLowerCase())
          );
        }

        setTickets(filteredTickets);
      } else {
        console.error("API returned error:", response);
        setTickets([]);
        setError(response?.message || "Failed to load tickets");
      }
    } catch (err) {
      console.error("Network error:", err);
      setTickets([]);
      setError(err.message || "Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get status display
  const getStatusDisplay = (status) => {
    const displays = {
      open: {
        icon: TicketIcon,
        color: "text-blue-600 bg-blue-50 border-blue-200",
        label: "Open",
      },
      assigned: {
        icon: UserIcon,
        color: "text-yellow-600 bg-yellow-50 border-yellow-200",
        label: "Assigned",
      },
      in_progress: {
        icon: ClockIcon,
        color: "text-orange-600 bg-orange-50 border-orange-200",
        label: "In Progress",
      },
      resolved: {
        icon: CheckCircleIcon,
        color: "text-green-600 bg-green-50 border-green-200",
        label: "Resolved",
      },
      closed: {
        icon: CheckCircleIcon,
        color: "text-gray-600 bg-gray-50 border-gray-200",
        label: "Closed",
      },
    };
    return displays[status] || displays.open;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    return aiChatService.getPriorityColor(priority);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ status: "", priority: "", category: "", search: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadTickets}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TicketIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Support Tickets
              </h2>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {tickets.length}
              </span>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="waiting_user">Waiting for User</option>
                    <option value="waiting_admin">Waiting for Admin</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={filters.priority}
                    onChange={(e) =>
                      handleFilterChange("priority", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="payment">Payment</option>
                    <option value="technical">Technical</option>
                    <option value="general">General</option>
                    <option value="account">Account</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-12">
            <div className="text-center">
              <TicketIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-2">No support tickets found</p>
              <p className="text-sm text-gray-400">
                When you escalate AI conversations, they'll appear here as
                support tickets
              </p>
            </div>
          </div>
        ) : (
          (tickets || []).map((ticket) => {
            const statusDisplay = getStatusDisplay(ticket.status);
            const isSelected = ticket.id === selectedTicket?.id;

            return (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(isSelected ? null : ticket)}
                className={`bg-white rounded-lg shadow border border-gray-200 p-6 cursor-pointer transition-all ${
                  isSelected
                    ? "ring-2 ring-blue-500 border-blue-300"
                    : "hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {ticket.ticketNumber}
                      </span>

                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusDisplay.color}`}
                      >
                        <statusDisplay.icon className="h-3 w-3 mr-1" />
                        {statusDisplay.label}
                      </span>

                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>

                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {ticket.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {ticket.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {ticket.description}
                    </p>

                    {/* Escalation reason */}
                    {ticket.escalationReason && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-gray-500">
                          Escalation Reason:
                        </span>
                        <p className="text-sm text-gray-700 mt-1">
                          {ticket.escalationReason}
                        </p>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>
                          Created{" "}
                          {aiChatService.formatTimestamp(ticket.createdAt)}
                        </span>
                      </div>

                      {ticket.assignedAdmin && (
                        <div className="flex items-center space-x-1">
                          <UserIcon className="h-3 w-3" />
                          <span>
                            Assigned to {ticket.assignedAdmin.fullName}
                          </span>
                        </div>
                      )}

                      {ticket.lastActivityAt && (
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-3 w-3" />
                          <span>
                            Last activity{" "}
                            {aiChatService.formatTimestamp(
                              ticket.lastActivityAt
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {ticket.tags && ticket.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 ml-4">
                      {(ticket.tags || []).slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {ticket.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{ticket.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded content */}
                {isSelected && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Timeline */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Timeline
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                            <div className="text-sm">
                              <span className="font-medium">Created</span>
                              <span className="text-gray-500 ml-2">
                                {aiChatService.formatTimestamp(
                                  ticket.createdAt
                                )}
                              </span>
                            </div>
                          </div>

                          {ticket.assignedAt && (
                            <div className="flex items-center space-x-3">
                              <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                              <div className="text-sm">
                                <span className="font-medium">Assigned</span>
                                <span className="text-gray-500 ml-2">
                                  {aiChatService.formatTimestamp(
                                    ticket.assignedAt
                                  )}
                                </span>
                              </div>
                            </div>
                          )}

                          {ticket.firstResponseAt && (
                            <div className="flex items-center space-x-3">
                              <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                              <div className="text-sm">
                                <span className="font-medium">
                                  First Response
                                </span>
                                <span className="text-gray-500 ml-2">
                                  {aiChatService.formatTimestamp(
                                    ticket.firstResponseAt
                                  )}
                                </span>
                              </div>
                            </div>
                          )}

                          {ticket.resolvedAt && (
                            <div className="flex items-center space-x-3">
                              <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                              <div className="text-sm">
                                <span className="font-medium">Resolved</span>
                                <span className="text-gray-500 ml-2">
                                  {aiChatService.formatTimestamp(
                                    ticket.resolvedAt
                                  )}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          {ticket.assignedAdmin && (
                            <div>
                              <span className="font-medium text-gray-600">
                                Assigned to:
                              </span>
                              <span className="ml-2">
                                {ticket.assignedAdmin.fullName}
                              </span>
                            </div>
                          )}

                          <div>
                            <span className="font-medium text-gray-600">
                              Category:
                            </span>
                            <span className="ml-2 capitalize">
                              {ticket.category}
                            </span>
                          </div>

                          <div>
                            <span className="font-medium text-gray-600">
                              Priority:
                            </span>
                            <span className="ml-2 capitalize">
                              {ticket.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
