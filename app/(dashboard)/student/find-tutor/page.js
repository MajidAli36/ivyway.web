"use client";
import {
  MagnifyingGlassIcon,
  AcademicCapIcon,
  UserIcon,
  StarIcon,
  CalendarIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { apiGet, apiPost } from "../utils/api";
import { useRouter } from "next/navigation";

// SearchFilters Component (unchanged)
const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  selectedSubject,
  setSelectedSubject,
  subjects,
  iwgspOnly,
  setIwgspOnly,
}) => {
  return (
    <div className="mb-8">
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name, subject or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Subject Filter */}
            <div className="relative w-full md:w-64">
              <select
                className="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          {/* IWGSP Tutor Filter */}
          <div className="mt-4 flex items-center">
            <input
              id="iwgspOnly"
              name="iwgspOnly"
              type="checkbox"
              checked={iwgspOnly}
              onChange={(e) => setIwgspOnly(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="iwgspOnly"
              className="ml-2 block text-sm text-gray-700 font-medium"
            >
              Show only IWGSP Tutors
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Modal Component (updated - removed book session button)
const ProfileModal = ({ isOpen, closeModal, tutor }) => {
  const router = useRouter();

  if (!tutor) return null;

  const handlePurchasePlan = () => {
    closeModal();
    router.push("/student/book-session");
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-[#243b53]"
                  >
                    Tutor Profile
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md p-1 text-gray-400 hover:bg-gray-100"
                    onClick={closeModal}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center">
                    <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                      {tutor.fullName
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-medium text-gray-900">
                        {tutor.fullName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {tutor.tutorProfile?.education || "Experienced tutor"}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          <StarSolid className="h-4 w-4 text-yellow-500" />
                          <span className="ml-1 text-sm font-medium">
                            {tutor.tutorProfile?.rating || "4.5"}
                          </span>
                        </div>
                        <span className="mx-2 text-xs text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {tutor.tutorProfile?.reviews || "10"} reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-md font-semibold">About</h4>
                    <p className="mt-2 text-gray-600">
                      {tutor.tutorProfile?.bio || "No bio available"}
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-md font-semibold">Subjects</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tutor.tutorProfile?.subjects?.map((subject) => (
                        <span
                          key={subject}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#dbeafe] text-blue-500"
                        >
                          <AcademicCapIcon className="h-4 w-4 mr-1" />
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-md font-semibold">Experience</h4>
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-5 w-5 mr-1 text-gray-400" />
                      <span>
                        {tutor.tutorProfile?.experience || "N/A"} years of
                        experience
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={handlePurchasePlan}
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Purchase Plan
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// Updated TutorCard Component (removed book session button)
const TutorCard = ({ tutor, onViewProfile }) => {
  const router = useRouter();

  const handlePurchasePlan = () => {
    router.push("/student/book-session");
  };

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden transition-all hover:shadow-lg">
      <div className="p-6">
        {/* Tutor Header */}
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
            {tutor.fullName
              .split(" ")
              .map((name) => name[0])
              .join("")}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              {tutor.fullName}
            </h3>
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                <StarSolid className="h-4 w-4 text-yellow-500" />
                <span className="ml-1 text-sm font-medium text-gray-700">
                  {tutor.tutorProfile?.rating || "4.5"}
                </span>
              </div>
              <span className="mx-2 text-xs text-gray-400">•</span>
              <span className="text-sm text-gray-600">
                {tutor.tutorProfile?.reviews || "10"} reviews
              </span>
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tutor.tutorProfile?.subjects?.map((subject) => (
            <span
              key={subject}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#dbeafe] text-blue-500"
            >
              <AcademicCapIcon className="h-4 w-4 mr-1" />
              {subject}
            </span>
          ))}
        </div>

        {/* Bio */}
        <p className="mt-4 text-sm text-gray-600 line-clamp-2">
          {tutor.tutorProfile?.bio ||
            "Experienced tutor with a passion for teaching."}
        </p>

        {/* Details */}
        <div className="mt-4 grid grid-cols-1 gap-2">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
            <span>
              {tutor.tutorProfile?.experience || "N/A"} years of experience
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex space-x-3">
          <button
            onClick={handlePurchasePlan}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Purchase Plan
          </button>
          <button
            onClick={() => onViewProfile(tutor)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-blue-500 text-sm font-medium rounded-full text-blue-500 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages } = pagination;

  return (
    <div className="mt-10 flex items-center justify-center">
      <nav className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`px-2 py-2 border border-gray-300 rounded-md ${
            page === 1
              ? "bg-gray-100 text-gray-400"
              : "bg-white text-blue-500 hover:bg-gray-50"
          }`}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-4 py-2 border rounded-md text-sm font-medium ${
              pageNum === page
                ? "border-blue-500 bg-blue-500 text-white"
                : "border-gray-300 bg-white text-blue-500 hover:bg-gray-50"
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={`px-2 py-2 border border-gray-300 rounded-md ${
            page === totalPages
              ? "bg-gray-100 text-gray-400"
              : "bg-white text-blue-500 hover:bg-gray-50"
          }`}
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
};

// Main Page Component
export default function FindTutorPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [iwgspOnly, setIwgspOnly] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });

  // Updated fetchTutors function that uses the apiGet utility
  const fetchTutors = async (page = 1, limit = 12) => {
    try {
      setLoading(true);

      // Use the subject filter if it's not "All Subjects"
      const subjectParam =
        selectedSubject !== "All Subjects"
          ? `&subject=${encodeURIComponent(selectedSubject)}`
          : "";
      const iwgspParam = iwgspOnly ? `&isIWGSPTutor=true` : "";

      const response = await apiGet(
        `tutors?page=${page}&limit=${limit}${subjectParam}${iwgspParam}`
      );

      if (response.success) {
        setTutors(response.data);
        setPagination({
          page: parseInt(response.pagination.page) || 1,
          limit: parseInt(response.pagination.limit) || 12,
          total: parseInt(response.pagination.total) || 0,
          totalPages: parseInt(response.pagination.totalPages) || 1,
        });
      } else {
        throw new Error(response.message || "Failed to fetch tutors");
      }

      setError(null);
    } catch (err) {
      setError(err.message || "An error occurred while fetching tutors");
      console.error("Failed to fetch tutors:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tutors when component mounts or subject filter changes
  useEffect(() => {
    fetchTutors(pagination.page, pagination.limit);
  }, [selectedSubject, iwgspOnly]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTutors(newPage, pagination.limit);
    }
  };

  // Handle opening the profile modal
  const openProfileModal = (tutor) => {
    setSelectedTutor(tutor);
    setIsProfileModalOpen(true);
  };

  // Filter tutors based on search query
  const filteredTutors = tutors.filter((tutor) => {
    if (!searchQuery) return true;

    const matchesName = tutor.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesBio = tutor.tutorProfile?.bio
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSubjects = tutor.tutorProfile?.subjects?.some((subject) =>
      subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return matchesName || matchesBio || matchesSubjects;
  });

  // Extract unique subjects for the filter dropdown
  const subjects = [
    "All Subjects",
    ...new Set(tutors.flatMap((tutor) => tutor.tutorProfile?.subjects || [])),
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tutors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 p-6 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <XMarkIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error loading tutors
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchTutors()}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 p-6">
      {/* Header with title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#243b53]">Find a Tutor</h1>
        <p className="text-[#4b5563] mt-1">
          Connect with expert tutors to boost your learning journey
        </p>
      </div>

      {/* Search and Filter Section */}
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        subjects={subjects}
        iwgspOnly={iwgspOnly}
        setIwgspOnly={setIwgspOnly}
      />

      {/* Tutors Grid */}
      {filteredTutors.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <TutorCard
                key={tutor.id}
                tutor={tutor}
                onViewProfile={openProfileModal}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tutors found
          </h3>
          <p className="text-gray-600">
            {tutors.length === 0
              ? "There are currently no tutors available."
              : "No tutors match your search criteria. Try adjusting your filters."}
          </p>
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        closeModal={() => setIsProfileModalOpen(false)}
        tutor={selectedTutor}
      />
    </div>
  );
}
