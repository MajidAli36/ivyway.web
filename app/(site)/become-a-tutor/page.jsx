"use client";

import Link from "next/link";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function BecomeATutorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold sm:text-5xl sm:tracking-tight lg:text-6xl">
                Become a Tutor
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
                Join our network of expert educators and make a difference in
                students' lives while earning competitive pay.
              </p>
            </div>
          </div>
        </div>

        {/* Why Become a Tutor */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Join IvyWay?
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600">
              Tutoring with us offers flexibility, competitive pay, and the
              chance to make a real impact.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Competitive Pay
              </h3>
              <p className="text-gray-600">
                Earn $25-$60 per hour depending on subject expertise and
                experience level.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Flexible Schedule
              </h3>
              <p className="text-gray-600">
                Set your own hours and availability. Work as much or as little
                as you want.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Professional Growth
              </h3>
              <p className="text-gray-600">
                Access training resources and join a community of dedicated
                educators.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Make an Impact
              </h3>
              <p className="text-gray-600">
                Help students achieve their academic goals and build confidence
                in their abilities.
              </p>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Tutor Requirements
                </h2>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <ul className="space-y-4">
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700">
                          <span className="font-medium text-gray-900">
                            Education:
                          </span>{" "}
                          Bachelor's degree or higher (in progress or completed)
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700">
                          <span className="font-medium text-gray-900">
                            Expertise:
                          </span>{" "}
                          Strong knowledge in at least one subject area
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700">
                          <span className="font-medium text-gray-900">
                            Experience:
                          </span>{" "}
                          Previous teaching or tutoring experience preferred
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700">
                          <span className="font-medium text-gray-900">
                            Technical:
                          </span>{" "}
                          Reliable internet connection and comfort with online
                          tools
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700">
                          <span className="font-medium text-gray-900">
                            Communication:
                          </span>{" "}
                          Excellent verbal and written communication skills
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700">
                          <span className="font-medium text-gray-900">
                            Background Check:
                          </span>{" "}
                          Must pass our background verification process
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 lg:mt-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Application Process
                </h2>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <ol className="space-y-6">
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                          1
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Online Application
                        </h3>
                        <p className="mt-1 text-gray-600">
                          Submit your profile, educational background, and
                          subject expertise.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                          2
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Subject Assessment
                        </h3>
                        <p className="mt-1 text-gray-600">
                          Complete assessments in your chosen subject areas to
                          verify expertise.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                          3
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Interview
                        </h3>
                        <p className="mt-1 text-gray-600">
                          Meet with our team to discuss your experience and
                          teaching approach.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                          4
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Background Check
                        </h3>
                        <p className="mt-1 text-gray-600">
                          Complete our verification process for security and
                          peace of mind.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                          5
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Onboarding
                        </h3>
                        <p className="mt-1 text-gray-600">
                          Training on our platform, policies, and best practices
                          for student success.
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects We Need */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            High-Demand Subjects
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Mathematics
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Calculus (AP, IB, College Level)</li>
                <li>• Statistics & Probability</li>
                <li>• Linear Algebra</li>
                <li>• Discrete Mathematics</li>
                <li>• Competition Math</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Sciences
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• AP/IB Physics</li>
                <li>• Organic Chemistry</li>
                <li>• AP/IB Biology</li>
                <li>• Computer Science</li>
                <li>• Engineering Subjects</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Test Prep
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• SAT/ACT</li>
                <li>• AP Exams</li>
                <li>• IB Exams</li>
                <li>• GRE/GMAT</li>
                <li>• MCAT/LSAT</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Languages
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Spanish</li>
                <li>• Mandarin Chinese</li>
                <li>• French</li>
                <li>• German</li>
                <li>• ESL/TOEFL/IELTS</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Humanities
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• AP/IB English Literature</li>
                <li>• Essay Writing</li>
                <li>• History</li>
                <li>• Philosophy</li>
                <li>• College Application Support</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-indigo-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Business & Economics
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Microeconomics</li>
                <li>• Macroeconomics</li>
                <li>• Accounting</li>
                <li>• Finance</li>
                <li>• Business Statistics</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tutor Testimonials */}
        <div className="bg-gray-900 py-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Hear From Our Tutors
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 mb-6"></div>
                <h3 className="text-xl font-semibold mb-1">Dr. James Chen</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Physics & Math Tutor • 3 years with IvyWay
                </p>
                <blockquote className="italic text-gray-300">
                  "Tutoring with IvyWay has been incredibly rewarding. The
                  platform makes it easy to connect with students who are
                  genuinely interested in learning, and the flexible schedule
                  allows me to maintain my research position while earning
                  additional income."
                </blockquote>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 mb-6"></div>
                <h3 className="text-xl font-semibold mb-1">
                  Jennifer Williams
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  English & Writing Tutor • 2 years with IvyWay
                </p>
                <blockquote className="italic text-gray-300">
                  "As a freelance writer, IvyWay has provided me with steady
                  income and the chance to help students find their voice.
                  Watching a student go from dreading writing assignments to
                  confidently expressing their ideas is incredibly fulfilling."
                </blockquote>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 mb-6"></div>
                <h3 className="text-xl font-semibold mb-1">Michael Thompson</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Computer Science Tutor • 4 years with IvyWay
                </p>
                <blockquote className="italic text-gray-300">
                  "The support IvyWay provides tutors is exceptional. The
                  training resources helped me become a better educator, and the
                  admin team handles all the scheduling and payment details so I
                  can focus on what I do best - teaching coding and computer
                  science."
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    How much can I earn as a tutor?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Tutor compensation ranges from $25-$60 per hour depending on
                    your education level, subject expertise, and experience.
                    Specialized subjects (advanced math, sciences, test prep)
                    and tutors with advanced degrees typically earn higher
                    rates.
                  </p>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    How often will I get paid?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Tutors are paid twice monthly via direct deposit. You'll
                    have access to a dashboard showing all completed sessions,
                    earnings, and payment history.
                  </p>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    How many hours can I expect to work?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    The number of hours depends on your availability, subjects
                    taught, and student demand. Some tutors work 5-10 hours per
                    week, while others work 20+ hours. You control your
                    schedule, and our matching system helps connect you with
                    students during your available hours.
                  </p>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Do I need to prepare lesson materials?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    IvyWay provides a library of resources for many subjects,
                    but tutors are encouraged to customize lessons to each
                    student's needs. You'll have access to our online whiteboard
                    and document sharing tools to facilitate effective sessions.
                  </p>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    What if I need to cancel a session?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    We understand emergencies happen. Our policy requires 24
                    hours notice for cancellations. Repeated last-minute
                    cancellations may affect your tutor rating and matching
                    priority. For planned absences, our support team can help
                    reschedule or find substitute tutors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Share Your Knowledge?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
              Join our network of talented educators and make a difference in
              students' lives.
            </p>
            <div className="mt-8">
              <Link href="/contact" passHref>
                <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 hover:cursor-pointer">
                  Apply Now
                </button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-blue-200">
              Applications are reviewed within 3-5 business days
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
