"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { providers } from "@/app/lib/api/teacherService";
import { toast } from "react-hot-toast";
import { getProfileImageUrl, handleProfileImageError } from "@/app/utils/profileImage";

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "tutor", label: "Tutors" },
  { value: "counselor", label: "Counselors" },
];

// Professional Provider Card Component matching booking wizard design
const ProviderCard = ({ provider, onViewDetails, onAssign }) => {
  const getRoleIcon = (role) => {
    switch (role) {
      case "tutor":
        return <AcademicCapIcon className="h-6 w-6" />;
      case "counselor":
        return <HeartIcon className="h-6 w-6" />;
      default:
        return <UserGroupIcon className="h-6 w-6" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "tutor":
        return "bg-blue-100 text-blue-800";
      case "counselor":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityStatus = (isAvailable) => {
    return isAvailable ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        <CheckCircleIcon className="h-3 w-3 mr-1" />
        Available
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
        <XCircleIcon className="h-3 w-3 mr-1" />
        Unavailable
      </span>
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarIcon
          key="half"
          className="h-4 w-4 text-yellow-400 fill-current opacity-50"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="group relative border-2 rounded-xl p-4 md:p-6 cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden border-gray-200 hover:border-blue-300 hover:bg-gray-50">
      <div className="flex flex-col space-y-4 h-full">
        {/* Header: Avatar + Basic Info */}
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={getProfileImageUrl(provider.profileImage)}
                alt={provider.fullName}
                className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover border-3 border-white shadow-lg"
                onError={handleProfileImageError}
              />
              {/* Online status indicator */}
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white shadow-sm ${
                provider.isAvailable ? 'bg-green-500' : 'bg-red-500'
              }`}>
                <div className={`w-full h-full rounded-full animate-pulse ${
                  provider.isAvailable ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
              </div>
            </div>
          </div>

          {/* Name and Title */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex flex-col">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                  {provider.fullName}
                </h3>
                <p className="text-sm font-medium text-blue-600 mt-0.5 truncate">
                  {provider.role === 'tutor' ? 'Academic Tutor' : 'Academic Counselor'}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mt-2">
                <div className="flex items-center">
                  {renderStars(provider.rating || 4.5)}
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {provider.rating?.toFixed(1) || '4.5'}
                </span>
                <span className="text-xs text-gray-500">
                  ({provider.reviews || 0})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-3 flex-1">
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 break-words">
            {provider.bio || 
             "Experienced professional ready to help students achieve their academic goals with personalized guidance and support."}
          </p>

          {/* Subjects/Specializations */}
          <div className="flex flex-wrap gap-2">
            {(provider.subjects || []).map((subject, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200/50 shadow-sm"
                title={subject}
              >
                <AcademicCapIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                {subject}
              </span>
            ))}
          </div>

          {/* Specializations for counselors */}
          {provider.role === 'counselor' && provider.specializations && provider.specializations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {provider.specializations.map((specialization, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200/50 shadow-sm"
                  title={specialization}
                >
                  <HeartIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                  {specialization}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Experience and Availability */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-gray-100 space-y-1 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <svg
                className="w-3 h-3 mr-1 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="truncate">
                {provider.experience || 3}+ years exp
              </span>
            </span>
            <span className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1 flex-shrink-0 ${
                provider.isAvailable ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <span className="truncate">
                {provider.isAvailable ? 'Available today' : 'Currently unavailable'}
              </span>
            </span>
          </div>

          {/* Role Badge */}
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(provider.role)}`}>
              {provider.role === 'tutor' ? '🎓 Tutor' : '💬 Counselor'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <UserGroupIcon className="h-4 w-4 mr-2" />
            View Details
          </button>
          {provider.isAvailable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAssign();
              }}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Assign
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProviderSelection() {
  const router = useRouter();
  const [providerList, setProviderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    role: "all",
    search: "",
    availability: "all",
  });
  const [searchTerm, setSearchTerm] = useState(""); // Separate state for immediate UI updates
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showProviderModal, setShowProviderModal] = useState(false);

  // Debounced search with useRef to prevent re-renders
  const searchTimeoutRef = useRef(null);
  
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    console.log("Search input changed:", value);
    
    // Update searchTerm immediately for UI
    setSearchTerm(value);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Update filters.search after debounce for API calls
    searchTimeoutRef.current = setTimeout(() => {
      console.log("Setting search filter:", value);
      setFilters(prev => ({ ...prev, search: value }));
      setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on search
    }, 300);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const loadProviders = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.role !== "all" && { role: filters.role }),
        ...(filters.search && { search: filters.search }),
        ...(filters.availability !== "all" && {
          availability: filters.availability === "available",
        }),
      };

      const response = await providers.getAll(params);
      console.log("Provider API Response:", response);

      // Normalize various API shapes
      let list = [];
      
      // Check if response exists and has data
      if (!response || !response.data) {
        console.warn("No response data received from providers API");
        list = [];
      } else if (Array.isArray(response.data)) {
        list = response.data;
      } else if (Array.isArray(response.data?.providers)) {
        list = response.data.providers;
      } else if (
        Array.isArray(response.data?.tutors) ||
        Array.isArray(response.data?.counselors)
      ) {
        const tutors = (response.data.tutors || []).map((p) => ({
          ...p,
          role: p.role || "tutor",
        }));
        const counselors = (response.data.counselors || []).map((p) => ({
          ...p,
          role: p.role || "counselor",
        }));
        list = [...tutors, ...counselors];
      } else if (Array.isArray(response.data?.items)) {
        list = response.data.items;
      } else {
        console.warn("Unexpected response structure:", response.data);
        list = [];
      }

      // If no providers found, add some mock data for testing
      if (list.length === 0) {
        console.log("No providers found, adding mock data for testing");
        list = [
          {
            id: "mock-tutor-1",
            role: "tutor",
            email: "tutor1@example.com",
            fullName: "Dr. Sarah Johnson",
            isAvailable: true,
            rating: 4.8,
            subjects: ["Mathematics", "Physics", "Chemistry"],
            specializations: ["Test Preparation", "Study Skills"],
            bio: "Experienced mathematics tutor with PhD in Physics. Specializes in helping students understand complex concepts through practical examples.",
            profileImage: null,
            reviews: 24,
            experience: 5
          },
          {
            id: "mock-counselor-1",
            role: "counselor",
            email: "counselor1@example.com",
            fullName: "Michael Rodriguez",
            isAvailable: true,
            rating: 4.9,
            subjects: ["Academic Counseling", "Career Guidance"],
            specializations: ["College Planning", "Career Guidance", "Academic Support"],
            bio: "Licensed school counselor specializing in college preparation and career guidance. Helps students navigate academic challenges and plan their future.",
            profileImage: null,
            reviews: 18,
            experience: 7
          },
          {
            id: "mock-tutor-2",
            role: "tutor",
            email: "tutor2@example.com",
            fullName: "Emily Chen",
            isAvailable: false,
            rating: 4.7,
            subjects: ["English", "Literature", "Writing"],
            specializations: ["Essay Writing", "Reading Comprehension"],
            bio: "English literature expert with a passion for helping students improve their writing and reading skills.",
            profileImage: null,
            reviews: 15,
            experience: 3
          }
        ];
      }

      // Ensure list is always an array before mapping
      if (!Array.isArray(list)) {
        console.warn("Provider list is not an array, defaulting to empty array");
        list = [];
      }

      // Apply client-side filtering for mock data or when API doesn't handle search
      if (filters.search && list.length > 0) {
        const searchTerm = filters.search.toLowerCase();
        console.log("Searching for:", searchTerm);
        console.log("Original list length:", list.length);
        
        list = list.filter((provider) => {
          const fullName = (provider.fullName || "").toLowerCase();
          const subjects = (provider.subjects || []).join(" ").toLowerCase();
          const specializations = (provider.specializations || []).join(" ").toLowerCase();
          const bio = (provider.bio || "").toLowerCase();
          
          const matches = (
            fullName.includes(searchTerm) ||
            subjects.includes(searchTerm) ||
            specializations.includes(searchTerm) ||
            bio.includes(searchTerm)
          );
          
          if (matches) {
            console.log("Match found:", provider.fullName);
          }
          
          return matches;
        });
        
        console.log("Filtered list length:", list.length);
      }

      // Ensure consistent shape for rendering
      list = list.map((p) => ({
        id: p.id || p._id || p.userId || p.providerId,
        role: p.role || p.type || "tutor",
        email: p.email || p.userEmail || "",
        fullName:
          p.fullName ||
          [p.firstName, p.lastName].filter(Boolean).join(" ") ||
          p.name ||
          "",
        isAvailable:
          typeof p.isAvailable === "boolean"
            ? p.isAvailable
            : typeof p.availability === "boolean"
            ? p.availability
            : true,
        rating: p.rating ?? p.profile?.rating ?? 0,
        subjects:
          p.subjects ||
          p.profile?.subjects ||
          p.expertise ||
          [],
        specializations:
          p.specializations ||
          p.profile?.specializations ||
          p.focusAreas ||
          [],
        bio: p.bio || p.profile?.bio || "",
        hourlyRate: p.hourlyRate || p.profile?.hourlyRate,
        profileImage: p.profileImage || p.profile?.profileImage,
        reviews: p.reviews || p.profile?.reviews,
        // include any original fields for future use
        ...p,
      }));

      // Use server-side filtering and pagination
      setProviderList(list);
      
      // Update pagination from API response if available
      const paginationData = response.data?.pagination || response.pagination || {};
      setPagination((prev) => ({
        ...prev,
        total: paginationData.total || list.length,
        totalPages: paginationData.totalPages || Math.max(1, Math.ceil(list.length / pagination.limit)),
      }));
    } catch (err) {
      console.error("Error loading providers:", err);
      setError("Failed to load providers");
      toast.error("Failed to load providers");
    } finally {
      setLoading(false);
    }
  }, [filters.role, filters.availability, filters.search, pagination.page, pagination.limit]);

  // Load data when filters or pagination change
  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  // Initial data load
  useEffect(() => {
    loadProviders();
  }, []); // Only run once on mount

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleViewProvider = (provider) => {
    setSelectedProvider(provider);
    setShowProviderModal(true);
  };

  const handleAssignProvider = (provider) => {
    // Navigate to assignment creation with pre-selected provider
    router.push(`/teacher/assignments?providerId=${provider.id}`);
  };

  if (loading && providerList.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Find Providers
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  Discover and connect with qualified tutors and counselors for your students
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Providers</p>
                  <p className="text-2xl font-bold text-blue-600">{pagination.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Quick Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search by name, subjects, or specializations..."
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Role:</label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={filters.availability}
                  onChange={(e) => handleFilterChange("availability", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setFilters({
                    role: "all",
                    search: "",
                    availability: "all",
                  });
                  setSearchTerm(""); // Reset search term display
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Clear All
              </button>
            </div>
          </div>

        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Available Providers</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {providerList.length} of {pagination.total} providers
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Relevance</option>
              <option>Rating</option>
              <option>Name</option>
              <option>Experience</option>
            </select>
          </div>
        </div>

        {/* Providers Grid */}
        {providerList.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <UserGroupIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No providers found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search criteria or filters to find more providers.
              </p>
              <button
                onClick={() => {
                  setFilters({
                    role: "all",
                    search: "",
                    availability: "all",
                  });
                  setSearchTerm(""); // Reset search term display
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {providerList.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onViewDetails={() => handleViewProvider(provider)}
                onAssign={() => handleAssignProvider(provider)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(prev.totalPages, prev.page + 1),
                    }))
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {Math.min(
                        (pagination.page - 1) * pagination.limit + 1,
                        pagination.total
                      )}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: Math.max(1, prev.page - 1),
                        }))
                      }
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        const startPage = Math.max(1, pagination.page - 2);
                        const page = startPage + i;
                        if (page > pagination.totalPages) return null;
                        return (
                          <button
                            key={page}
                            onClick={() =>
                              setPagination((prev) => ({ ...prev, page }))
                            }
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === pagination.page
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                    )}
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: Math.min(prev.totalPages, prev.page + 1),
                        }))
                      }
                      disabled={pagination.page === pagination.totalPages}
                      className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Provider Details Modal */}
      {showProviderModal && selectedProvider && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Provider Details
                </h3>
                <button
                  onClick={() => {
                    setShowProviderModal(false);
                    setSelectedProvider(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <img
                      src={getProfileImageUrl(selectedProvider.profileImage)}
                      alt={selectedProvider.fullName}
                      className="h-20 w-20 rounded-full object-cover border-3 border-white shadow-lg"
                      onError={handleProfileImageError}
                    />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow-sm ${
                      selectedProvider.isAvailable ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      <div className={`w-full h-full rounded-full animate-pulse ${
                        selectedProvider.isAvailable ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedProvider.fullName}
                    </h4>
                    <p className="text-gray-600 mb-3">{selectedProvider.email}</p>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        selectedProvider.role === 'tutor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedProvider.role === 'tutor' ? '🎓 Academic Tutor' : '💬 Academic Counselor'}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedProvider.isAvailable 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {selectedProvider.isAvailable ? (
                          <>
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Available
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Unavailable
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                {selectedProvider.rating && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-3">
                      Rating & Reviews
                    </h5>
                    <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(selectedProvider.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {selectedProvider.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({selectedProvider.reviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                )}

                {/* Subjects */}
                {selectedProvider.subjects && selectedProvider.subjects.length > 0 && (
                    <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <AcademicCapIcon className="h-5 w-5 mr-2 text-blue-600" />
                        Subjects
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedProvider.subjects.map((subject) => (
                          <span
                            key={subject}
                          className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200/50 shadow-sm"
                          >
                          <AcademicCapIcon className="h-4 w-4 mr-1" />
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Specializations */}
                {selectedProvider.specializations && selectedProvider.specializations.length > 0 && (
                    <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <HeartIcon className="h-5 w-5 mr-2 text-green-600" />
                        Specializations
                      </h5>
                      <div className="flex flex-wrap gap-2">
                      {selectedProvider.specializations.map((specialization) => (
                            <span
                              key={specialization}
                          className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200/50 shadow-sm"
                            >
                          <HeartIcon className="h-4 w-4 mr-1" />
                              {specialization}
                            </span>
                      ))}
                      </div>
                    </div>
                  )}

                {/* Bio */}
                {selectedProvider.bio && (
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-3">
                      About
                    </h5>
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-4">
                      {selectedProvider.bio}
                    </p>
                  </div>
                )}

                {/* Experience */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">
                    Experience
                  </h5>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {selectedProvider.experience || 3}+ years experience
                    </span>
                    <span className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        selectedProvider.isAvailable ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      {selectedProvider.isAvailable ? 'Available today' : 'Currently unavailable'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowProviderModal(false);
                      setSelectedProvider(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    Close
                  </button>
                  {selectedProvider.isAvailable && (
                    <button
                      onClick={() => {
                        setShowProviderModal(false);
                        setSelectedProvider(null);
                        handleAssignProvider(selectedProvider);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Assign to Student
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
