"use client";

import Link from "next/link";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ReactAIWidget from "../../components/ai-chat/ReactAIWidget";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                How IvyWay Works
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
                A simple, effective process to connect you with the perfect
                tutor for your learning journey.
              </p>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-between">
              <div className="bg-white px-4">
                <span className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  1
                </span>
              </div>
              <div className="bg-white px-4">
                <span className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  2
                </span>
              </div>
              <div className="bg-white px-4">
                <span className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  3
                </span>
              </div>
              <div className="bg-white px-4">
                <span className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  4
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Tell Us What You Need
              </h2>
              <p className="mt-4 text-gray-600">
                Share your academic goals, the subjects you need help with, and
                your availability.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Match With Your Tutor
              </h2>
              <p className="mt-4 text-gray-600">
                We'll match you with tutors who specialize in your subject and
                fit your schedule.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Schedule Sessions
              </h2>
              <p className="mt-4 text-gray-600">
                Book your first session and establish a regular tutoring
                schedule that works for you.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Learn and Grow
              </h2>
              <p className="mt-4 text-gray-600">
                Meet with your tutor online or in-person and watch your academic
                performance improve.
              </p>
            </div>
          </div>
        </div>

        {/* Tutoring Options */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Tutoring Options
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Flexible learning solutions to fit your lifestyle.
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {/* Online Tutoring */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Online Tutoring
                  </h3>
                  <p className="mt-4 text-gray-600">
                    Connect with tutors from anywhere in the world through our
                    secure video platform. All you need is an internet
                    connection and a device.
                  </p>
                  <ul className="mt-6 space-y-2">
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-green-500 flex-shrink-0">
                        ✓
                      </span>
                      <span className="ml-2 text-gray-600">
                        Interactive whiteboard tools
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-green-500 flex-shrink-0">
                        ✓
                      </span>
                      <span className="ml-2 text-gray-600">
                        Screen sharing capabilities
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-green-500 flex-shrink-0">
                        ✓
                      </span>
                      <span className="ml-2 text-gray-600">
                        Recorded sessions for review
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* In-Person Tutoring */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    In-Person Tutoring
                  </h3>
                  <p className="mt-4 text-gray-600">
                    Meet face-to-face with tutors in your area for a
                    personalized learning experience. Available in select
                    locations.
                  </p>
                  <ul className="mt-6 space-y-2">
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-green-500 flex-shrink-0">
                        ✓
                      </span>
                      <span className="ml-2 text-gray-600">
                        Home or library sessions
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-green-500 flex-shrink-0">
                        ✓
                      </span>
                      <span className="ml-2 text-gray-600">
                        Physical learning materials
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-green-500 flex-shrink-0">
                        ✓
                      </span>
                      <span className="ml-2 text-gray-600">
                        Hands-on learning activities
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Group Tutoring */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Group Tutoring
                  </h3>
                  <p className="mt-4 text-gray-600">
                    Learn with peers at a more affordable rate. Perfect for
                    study groups or friends preparing for the same exams.
                  </p>
                  <ul className="mt-6 space-y-2">
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-green-500 flex-shrink-0">
                        ✓
                      </span>
                      <span className="ml-2 text-gray-600">
                        2-5 students per session
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-green-500 flex-shrink-0">
                        ✓
                      </span>
                      <span className="ml-2 text-gray-600">
                        Collaborative problem solving
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-green-500 flex-shrink-0">
                        ✓
                      </span>
                      <span className="ml-2 text-gray-600">
                        Reduced rates per student
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
              Take the first step toward academic success today.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
              >
                Sign Up Now
              </Link>
              <Link
                href="/subjects"
                className="ml-4 inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700"
              >
                Explore Subjects
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Find answers to common questions about our tutoring services.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  How much does tutoring cost?
                </h3>
                <p className="mt-2 text-gray-600">
                  Tutoring rates vary based on subject, tutor experience, and
                  session format. Online sessions typically range from $30-70
                  per hour, while in-person sessions may cost $40-90 per hour.
                  Group sessions offer reduced per-student rates.
                </p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  How long are tutoring sessions?
                </h3>
                <p className="mt-2 text-gray-600">
                  Standard sessions are 60 minutes, but we offer flexibility
                  with 30, 45, and 90-minute options depending on your needs.
                  For younger students, shorter sessions may be more effective.
                </p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  How do I know if my tutor is qualified?
                </h3>
                <p className="mt-2 text-gray-600">
                  All our tutors undergo a rigorous selection process, including
                  academic credential verification, teaching experience
                  assessment, and background checks. We only accept
                  approximately 15% of tutor applicants to ensure the highest
                  quality.
                </p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Can I change tutors if it's not a good fit?
                </h3>
                <p className="mt-2 text-gray-600">
                  Absolutely! We want to ensure you have the best learning
                  experience. If you're not satisfied with your tutor for any
                  reason, contact us and we'll match you with someone new at no
                  additional cost.
                </p>
              </div>
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
