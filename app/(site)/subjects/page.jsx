"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ReactAIWidget from "../../components/ai-chat/ReactAIWidget";

// Define subject categories with their subjects
const subjectCategories = [
  {
    id: "mathematics",
    name: "Mathematics",
    color: "bg-blue-500",
    subjects: [
      "Algebra",
      "Geometry",
      "Calculus",
      "Statistics",
      "Trigonometry",
      "Pre-Calculus",
      "AP Calculus",
      "Linear Algebra",
      "Discrete Mathematics",
    ],
  },
  {
    id: "science",
    name: "Science",
    color: "bg-green-500",
    subjects: [
      "Biology",
      "Chemistry",
      "Physics",
      "Earth Science",
      "Environmental Science",
      "AP Biology",
      "AP Chemistry",
      "AP Physics",
      "Astronomy",
      "Organic Chemistry",
    ],
  },
  {
    id: "english",
    name: "English & Language Arts",
    color: "bg-purple-500",
    subjects: [
      "Reading Comprehension",
      "Writing",
      "Grammar",
      "Literature",
      "Essay Writing",
      "Creative Writing",
      "AP English Literature",
      "AP English Language",
      "Poetry",
    ],
  },
  {
    id: "foreign-languages",
    name: "Foreign Languages",
    color: "bg-yellow-500",
    subjects: [
      "Spanish",
      "French",
      "German",
      "Italian",
      "Chinese",
      "Japanese",
      "Russian",
      "Arabic",
      "Latin",
      "Portuguese",
    ],
  },
  {
    id: "social-studies",
    name: "Social Studies",
    color: "bg-red-500",
    subjects: [
      "History",
      "Geography",
      "Economics",
      "Political Science",
      "Psychology",
      "Sociology",
      "AP World History",
      "AP US History",
      "AP Human Geography",
    ],
  },
  {
    id: "test-prep",
    name: "Test Preparation",
    color: "bg-indigo-500",
    subjects: [
      "SAT",
      "ACT",
      "GRE",
      "GMAT",
      "LSAT",
      "MCAT",
      "AP Exams",
      "IB Exams",
      "State Standardized Tests",
    ],
  },
  {
    id: "computer-science",
    name: "Computer Science",
    color: "bg-teal-500",
    subjects: [
      "Programming",
      "Web Development",
      "Python",
      "Java",
      "C++",
      "Data Structures",
      "Algorithms",
      "AP Computer Science",
      "Machine Learning",
    ],
  },
  {
    id: "arts",
    name: "Arts & Music",
    color: "bg-pink-500",
    subjects: [
      "Music Theory",
      "Art History",
      "Drawing",
      "Painting",
      "Digital Art",
      "Photography",
      "Film Studies",
      "Theater",
      "Dance",
    ],
  },
];

export default function SubjectsPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        {/* Back Navigation (consistent with Testimonials) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors group"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold sm:text-5xl sm:tracking-tight lg:text-6xl">
                Subjects We Offer
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
                Expert tutoring across a wide range of academic disciplines for
                students of all ages and levels.
              </p>
            </div>
          </div>
        </div>

        {/* Subject Categories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {subjectCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
              >
                <div className={`${category.color} h-2`}></div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {category.name}
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {category.subjects.map((subject) => (
                      <li key={subject} className="flex items-center">
                        <span
                          className={`h-2 w-2 rounded-full ${category.color} mr-2`}
                        ></span>
                        <span className="text-gray-700">{subject}</span>
                      </li>
                    ))}
                  </ul>
                  {/* Removed "Learn more" links */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Levels */}
        <div className="bg-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Tutoring for All Academic Levels
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
                Our tutors adapt their teaching methods to meet your specific
                grade level and learning needs.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Elementary School */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold mb-4">
                  E
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Elementary School
                </h3>
                <p className="mt-2 text-gray-600">
                  Building fundamental skills in reading, writing, math, and
                  science with engaging, age-appropriate lessons.
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Grades K-5
                  </span>
                </div>
              </div>

              {/* Middle School */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold mb-4">
                  M
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Middle School
                </h3>
                <p className="mt-2 text-gray-600">
                  Supporting the transition to more advanced concepts and
                  developing strong study habits.
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Grades 6-8
                  </span>
                </div>
              </div>

              {/* High School */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl font-bold mb-4">
                  H
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  High School
                </h3>
                <p className="mt-2 text-gray-600">
                  Mastering complex subjects, preparing for college, and
                  excelling on standardized tests.
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Grades 9-12
                  </span>
                </div>
              </div>

              {/* College */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl font-bold mb-4">
                  C
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  College & University
                </h3>
                <p className="mt-2 text-gray-600">
                  Providing expert help with undergraduate and graduate-level
                  courses across disciplines.
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Undergraduate & Graduate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Approach to Teaching */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Our Approach to Teaching
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                We believe effective tutoring is about more than just explaining
                concepts. Our tutors are trained to:
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      1
                    </div>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong>Assess</strong> your learning style and current
                    knowledge
                  </p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      2
                    </div>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong>Personalize</strong> teaching methods to your unique
                    needs
                  </p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      3
                    </div>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong>Build</strong> your confidence through positive
                    reinforcement
                  </p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      4
                    </div>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong>Develop</strong> lasting study skills and critical
                    thinking
                  </p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      5
                    </div>
                  </div>
                  <p className="ml-3 text-gray-700">
                    <strong>Track</strong> progress and adjust strategies as
                    needed
                  </p>
                </li>
              </ul>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="bg-blue-100 rounded-xl p-8 h-full">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  What Makes Our Tutoring Different
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-blue-500 flex-shrink-0">
                      ✓
                    </span>
                    <span className="ml-2 text-gray-700">
                      <strong>Expert tutors</strong> with advanced degrees and
                      teaching experience
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-blue-500 flex-shrink-0">
                      ✓
                    </span>
                    <span className="ml-2 text-gray-700">
                      <strong>Adaptive learning</strong> that adjusts to your
                      pace and comprehension
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-blue-500 flex-shrink-0">
                      ✓
                    </span>
                    <span className="ml-2 text-gray-700">
                      <strong>Regular progress reports</strong> to track
                      improvement
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-blue-500 flex-shrink-0">
                      ✓
                    </span>
                    <span className="ml-2 text-gray-700">
                      <strong>Supplementary resources</strong> tailored to your
                      learning objectives
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-blue-500 flex-shrink-0">
                      ✓
                    </span>
                    <span className="ml-2 text-gray-700">
                      <strong>Flexible scheduling</strong> that works around
                      your commitments
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Excel in Your Studies?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
              Connect with an expert tutor today and take the first step toward
              academic success.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
              >
                Get Started
              </Link>
              <Link
                href="/contact"
                className="ml-4 inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* AI Widget */}
      <ReactAIWidget userRole="visitor" position="bottom-right" />
    </div>
  );
}
