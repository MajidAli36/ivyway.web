"use client";

import { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

// Sample tutor data
const tutors = [
  {
    id: 1,
    name: "Dr. Emily Johnson",
    image: "/tutors/emily.jpg",
    subjects: ["Mathematics", "Physics"],
    education: "Ph.D. in Mathematics, MIT",
    experience: "12 years teaching experience",
    rating: 4.9,
    reviewCount: 128,
  },
  {
    id: 2,
    name: "Professor James Wilson",
    image: "/tutors/james.jpg",
    subjects: ["Chemistry", "Biology"],
    education: "Ph.D. in Chemistry, Stanford University",
    experience: "15 years teaching experience",
    rating: 4.8,
    reviewCount: 143,
  },
  {
    id: 3,
    name: "Sarah Martinez",
    image: "/tutors/sarah.jpg",
    subjects: ["English Literature", "Writing"],
    education: "Master's in English Literature, Columbia University",
    experience: "8 years teaching experience",
    rating: 4.9,
    reviewCount: 97,
  },
  {
    id: 4,
    name: "David Lee",
    image: "/tutors/david.jpg",
    subjects: ["Computer Science", "Coding"],
    education: "B.S. in Computer Science, UC Berkeley",
    experience: "6 years teaching experience",
    rating: 4.7,
    reviewCount: 78,
  },
  {
    id: 5,
    name: "Rebecca Wong",
    image: "/tutors/rebecca.jpg",
    subjects: ["History", "Political Science"],
    education: "Ph.D. in History, Harvard University",
    experience: "10 years teaching experience",
    rating: 4.8,
    reviewCount: 112,
  },
  {
    id: 6,
    name: "Michael Brown",
    image: "/tutors/michael.jpg",
    subjects: ["Economics", "Statistics"],
    education: "Master's in Economics, London School of Economics",
    experience: "9 years teaching experience",
    rating: 4.7,
    reviewCount: 89,
  },
];

// Subject filters
const subjects = [
  "All Subjects",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English Literature",
  "Writing",
  "Computer Science",
  "Coding",
  "History",
  "Political Science",
  "Economics",
  "Statistics",
];

export default function OurTutorsPage() {
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tutors based on selected subject and search query
  const filteredTutors = tutors.filter((tutor) => {
    const matchesSubject =
      selectedSubject === "All Subjects" ||
      tutor.subjects.includes(selectedSubject);
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subjects.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold sm:text-5xl sm:tracking-tight lg:text-6xl">
                Meet Our Expert Tutors
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
                Learn from the best with our carefully vetted educators,
                passionate about helping students succeed.
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:w-64 mb-4 md:mb-0">
              <label
                htmlFor="subject-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Subject
              </label>
              <select
                id="subject-filter"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:w-72">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Tutors
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or subject"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tutors Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filteredTutors.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">
                No tutors found
              </h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:transform hover:scale-105"
                >
                  <div className="h-48 w-full bg-blue-200"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {tutor.name}
                    </h3>
                    <div className="mt-1 flex items-center">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-gray-700">
                          {tutor.rating}
                        </span>
                      </div>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-600">
                        {tutor.reviewCount} reviews
                      </span>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500">
                        Subjects
                      </h4>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {tutor.subjects.map((subject) => (
                          <span
                            key={subject}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500">
                        Education
                      </h4>
                      <p className="mt-1 text-sm text-gray-700">
                        {tutor.education}
                      </p>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500">
                        Experience
                      </h4>
                      <p className="mt-1 text-sm text-gray-700">
                        {tutor.experience}
                      </p>
                    </div>
                    <div className="mt-6">
                      <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Join Our Team */}
        {/* <div className="bg-blue-50 mt-12 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Join Our Team of Tutors</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Are you passionate about education? Apply to become a tutor and share your knowledge with students worldwide.
            </p>
            <div className="mt-8">
              <a
                href="/for-tutors"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div> */}
      </main>

      <Footer />
    </div>
  );
}
