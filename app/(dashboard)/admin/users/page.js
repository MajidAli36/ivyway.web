"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  UserIcon,
  AcademicCapIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import UserModal from "./components/UserModal";
import { useNotificationHelpers } from "../../../components/shared/NotificationSystem";
import { API_CONFIG } from "../../../lib/api/config"; // Import the API configuration

export default function AdminUsers() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [roleCounts, setRoleCounts] = useState({
    all: 0,
    student: 0,
    tutor: 0,
    counselor: 0,
  });
  // Stable counts independent from current filtered page
  const fetchRoleCounts = async () => {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/admin/users?page=1&limit=1000`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      const list = data?.data?.users || [];
      const counts = list.reduce(
        (acc, u) => {
          acc.all += 1;
          if (u.role === "student") acc.student += 1;
          else if (u.role === "tutor") acc.tutor += 1;
          else if (u.role === "counselor") acc.counselor += 1;
          return acc;
        },
        { all: 0, student: 0, tutor: 0, counselor: 0 }
      );
      setRoleCounts(counts);
    } catch (e) {
      console.error("Error fetching role counts:", e);
    }
  };
  // API data state
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  // Toast helpers
  const { showSuccess, showError } = useNotificationHelpers();

  // Fetch users from API
  const fetchUsers = async (page = 1, limit = 10, role = null) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use API_CONFIG.baseURL instead of hardcoded URL
      let url = `${API_CONFIG.baseURL}/admin/users?page=${page}&limit=${limit}`;

      if (role && role !== "all") {
        url += `&role=${role}`;
      }

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // The API returns "success" even though the structure might be different
      // We need to check if the users array exists in the response
      if (data.data && data.data.users) {
        // Client-side fallback search by name/email to ensure UX even if backend ignores search param
        let list = data.data.users;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          list = list.filter(
            (u) =>
              (u.fullName && u.fullName.toLowerCase().includes(q)) ||
              (u.email && u.email.toLowerCase().includes(q))
          );
        }
        setUsers(list);
        const totalForPagination = list.length;
        setPagination(
          data.data.pagination || {
            total: totalForPagination,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalForPagination / limit),
          }
        );
      } else {
        // If users array is not found in the expected structure
        console.error("Unexpected API response format:", data);
        throw new Error("Unexpected API response format");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers(
      pagination.page,
      pagination.limit,
      selectedFilter === "all" ? null : selectedFilter
    );
    fetchRoleCounts();
  }, [selectedFilter, pagination.page, pagination.limit]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(
        1,
        pagination.limit,
        selectedFilter === "all" ? null : selectedFilter
      );
      fetchRoleCounts();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get counts for filter tabs
  const userCounts = roleCounts;

  const roleIcons = {
    student: UserIcon,
    tutor: AcademicCapIcon,
    counselor: UserGroupIcon,
  };

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsLoading(true);
    try {
      // Use API_CONFIG.baseURL instead of hardcoded URL
      const response = await fetch(
        `${API_CONFIG.baseURL}/admin/users/${userToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        // Refetch users after successful deletion
        fetchUsers(
          pagination.page,
          pagination.limit,
          selectedFilter === "all" ? null : selectedFilter
        );
        fetchRoleCounts();
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        alert(data.message || "User deleted successfully");
      } else {
        throw new Error(data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenUserModal = (user = null) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    setIsLoading(true);
    try {
      if (userData.id) {
        // For existing users, we don't need to make a separate user update API call
        // Just update the tutor profile if the role is tutor
        if (userData.role === "tutor") {
          // Use API_CONFIG.baseURL instead of hardcoded URL
          const response = await fetch(
            `${API_CONFIG.baseURL}/tutors/${userData.id}/profile`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData.tutorProfile),
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const data = await response.json();
          // Accept either { success: true } or { status: "success" }
          if (data?.success === true || data?.status === "success") {
            // Refetch users after successful save
            fetchUsers(
              pagination.page,
              pagination.limit,
              selectedFilter === "all" ? null : selectedFilter
            );
            fetchRoleCounts();
            setIsUserModalOpen(false);
            showSuccess("Updated", data?.message || "User updated successfully", { duration: 3500 });
          } else {
            throw new Error(data.message || "Failed to save user");
          }
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
      showError("Update failed", error?.message || "Failed to save user");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(
        newPage,
        pagination.limit,
        selectedFilter === "all" ? null : selectedFilter
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#243b53] flex items-center">
            <UserGroupIcon className="h-7 w-7 mr-2 text-blue-600" />
            User Management
          </h1>
          <p className="mt-1 text-[#6b7280]">
            Manage all platform users, their roles, and access permissions
          </p>
        </div>
        {/* <div className="mt-4 sm:mt-0">
          <button
            onClick={() => handleOpenUserModal()}
            className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add User
          </button>
        </div> */}
      </div>

      <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
        {/* Filters and Search */}
        <div className="border-b border-gray-100">
          <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex overflow-x-auto pb-1 md:pb-0 space-x-1">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "text-[#6b7280] hover:bg-[#dbeafe] hover:text-[#4f46e5]"
                }`}
                onClick={() => setSelectedFilter("all")}
              >
                All Users{" "}
                <span
                  className={`ml-1 ${
                    selectedFilter === "all" ? "text-white" : "text-[#9ca3af]"
                  }`}
                >
                  ({userCounts.all})
                </span>
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedFilter === "student"
                    ? "bg-blue-600 text-white"
                    : "text-[#6b7280] hover:bg-[#dbeafe] hover:text-[#4f46e5]"
                }`}
                onClick={() => setSelectedFilter("student")}
              >
                Students{" "}
                <span
                  className={`ml-1 ${
                    selectedFilter === "student"
                      ? "text-white"
                      : "text-[#9ca3af]"
                  }`}
                >
                  ({userCounts.student})
                </span>
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedFilter === "tutor"
                    ? "bg-blue-600 text-white"
                    : "text-[#6b7280] hover:bg-[#dbeafe] hover:text-[#4f46e5]"
                }`}
                onClick={() => setSelectedFilter("tutor")}
              >
                Tutors{" "}
                <span
                  className={`ml-1 ${
                    selectedFilter === "tutor" ? "text-white" : "text-[#9ca3af]"
                  }`}
                >
                  ({userCounts.tutor})
                </span>
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedFilter === "counselor"
                    ? "bg-blue-600 text-white"
                    : "text-[#6b7280] hover:bg-[#dbeafe] hover:text-[#4f46e5]"
                }`}
                onClick={() => setSelectedFilter("counselor")}
              >
                Counselors{" "}
                <span
                  className={`ml-1 ${
                    selectedFilter === "counselor"
                      ? "text-white"
                      : "text-[#9ca3af]"
                  }`}
                >
                  ({userCounts.counselor})
                </span>
              </button>
            </div>

            <div className="relative md:w-80">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-[#9ca3af]" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full pl-10 pr-10 py-2 text-sm rounded-full border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          {error && (
            <div className="p-4 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <ExclamationCircleIcon className="h-10 w-10 text-red-500" />
              </div>
              <p className="text-red-600 font-medium">Error loading users</p>
              <p className="text-sm text-[#6b7280] mt-1">{error}</p>
              <button
                onClick={() =>
                  fetchUsers(
                    pagination.page,
                    pagination.limit,
                    selectedFilter === "all" ? null : selectedFilter
                  )
                }
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          )}

          {!error && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                  >
                    Role
                  </th>
                  
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                  >
                    Joined
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-right text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  // Loading state
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <tr key={`skeleton-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                            <div className="ml-4">
                              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                              <div className="h-3 bg-gray-200 rounded w-40 mt-2 animate-pulse"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-36 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-end space-x-2">
                            <div className="h-8 bg-gray-200 rounded-full w-8 animate-pulse"></div>
                            <div className="h-8 bg-gray-200 rounded-full w-8 animate-pulse"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : users.length > 0 ? (
                  users.map((user) => {
                    const RoleIcon = roleIcons[user.role] || UserIcon;

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium">
                              {user.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#243b53]">
                                {user.fullName}
                              </div>
                              <div className="text-sm text-[#6b7280]">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm">
                            <RoleIcon className="h-4 w-4 mr-2 text-[#9ca3af]" />
                            <span className="font-medium text-[#334e68] capitalize">
                              {user.role}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              className="p-1.5 rounded-full text-[#6b7280] hover:bg-[#dbeafe] hover:text-[#4f46e5] transition-colors"
                              onClick={() => handleOpenUserModal(user)}
                            >
                              <PencilIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                            <button
                              className="p-1.5 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                              onClick={() => handleOpenDeleteModal(user)}
                              disabled={isLoading}
                            >
                              <TrashIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <UserGroupIcon className="h-10 w-10 text-[#9ca3af]" />
                      </div>
                      <p className="text-[#243b53] font-medium">
                        No users found
                      </p>
                      <p className="text-sm text-[#6b7280] mt-1">
                        Try adjusting your search or filter criteria
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-100">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-[#6b7280] bg-white hover:bg-[#dbeafe] transition-colors"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || isLoading}
            >
              Previous
            </button>
            <button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-[#6b7280] bg-white hover:bg-[#dbeafe] transition-colors"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || isLoading}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[#6b7280]">
                Showing{" "}
                <span className="font-medium text-[#243b53]">
                  {users.length > 0
                    ? (pagination.page - 1) * pagination.limit + 1
                    : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium text-[#243b53]">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[#243b53]">
                  {pagination.total}
                </span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-full shadow-sm overflow-hidden"
                aria-label="Pagination"
              >
                <button
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-[#6b7280] hover:bg-[#dbeafe] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1 || isLoading}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Generate page buttons */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= pagination.page - 1 &&
                        page <= pagination.page + 1)
                  )
                  .map((page, index, array) => {
                    // Add ellipsis where needed
                    const showEllipsisBefore =
                      index > 0 && array[index - 1] !== page - 1;
                    const showEllipsisAfter =
                      index < array.length - 1 && array[index + 1] !== page + 1;

                    return (
                      <div key={page}>
                        {showEllipsisBefore && (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}

                        <button
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                            page === pagination.page
                              ? "bg-blue-600 text-white"
                              : "bg-white text-[#6b7280] hover:bg-[#dbeafe] transition-colors"
                          }`}
                          onClick={() => handlePageChange(page)}
                          disabled={isLoading}
                        >
                          {page}
                        </button>

                        {showEllipsisAfter && (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}
                      </div>
                    );
                  })}

                <button
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-[#6b7280] hover:bg-[#dbeafe] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={
                    pagination.page >= pagination.totalPages || isLoading
                  }
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* User Edit Modal */}
      <UserModal
        user={selectedUser}
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.fullName}? This action cannot be undone.`}
        isDeleting={isLoading}
      />
    </div>
  );
}
