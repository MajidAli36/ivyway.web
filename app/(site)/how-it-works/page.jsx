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
                Simple, effective processes to connect you with expert tutors and counselors for your academic success.
              </p>
            </div>
          </div>
        </div>

        {/* Tutoring Process Steps */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Academic Tutoring Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized tutoring support in just a few simple steps
            </p>
          </div>

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
              <h3 className="text-xl font-semibold text-gray-900">
                Tell Us What You Need
              </h3>
              <p className="mt-4 text-gray-600">
                Share your academic goals, the subjects you need help with, and your availability.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Match With Your Tutor
              </h3>
              <p className="mt-4 text-gray-600">
                We'll match you with expert tutors who specialize in your subject and fit your schedule.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Schedule Sessions
              </h3>
              <p className="mt-4 text-gray-600">
                Book your first session and establish a regular tutoring schedule that works for you.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Learn and Grow
              </h3>
              <p className="mt-4 text-gray-600">
                Meet with your tutor online or in-person and watch your academic performance improve.
              </p>
            </div>
          </div>
        </div>

        {/* College Counseling Process Steps */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">College Counseling Process</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Navigate your college journey with expert guidance and personalized support
              </p>
            </div>

            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-between">
                <div className="bg-gray-50 px-4">
                  <span className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                    1
                  </span>
                </div>
                <div className="bg-gray-50 px-4">
                  <span className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                    2
                  </span>
                </div>
                <div className="bg-gray-50 px-4">
                  <span className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                    3
                  </span>
                </div>
                <div className="bg-gray-50 px-4">
                  <span className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                    4
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-4">
              {/* Step 1 */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Complete Assessment
                </h3>
                <p className="mt-4 text-gray-600">
                  Share your academic background, interests, career goals, and college aspirations with your counselor.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Meet Your Counselor
                </h3>
                <p className="mt-4 text-gray-600">
                  Connect with experienced college counselors who understand your goals and can provide personalized guidance.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Develop Your Strategy
                </h3>
                <p className="mt-4 text-gray-600">
                  Work together to create a comprehensive college application strategy, including school selection and timeline.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Get Personalized Guidance
                </h3>
                <p className="mt-4 text-gray-600">
                  Receive tailored advice on college selection, applications, essays, financial aid, and academic planning.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Options */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Service Options
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Flexible learning and guidance solutions to fit your lifestyle and academic needs.
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {/* Tutoring Services */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 px-6 py-4">
                  <h3 className="text-xl font-semibold text-white">
                    Academic Tutoring Services
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    Personalized one-on-one tutoring with expert instructors across all subjects and grade levels.
                  </p>
                  
                  <div className="space-y-6">
                    {/* Online Tutoring */}
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Online Tutoring</h4>
                      <p className="text-gray-600 mb-3">
                        Connect with tutors from anywhere through our secure video platform with interactive tools.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>Interactive whiteboard tools</span>
                        </li>
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>Screen sharing capabilities</span>
                        </li>
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>Recorded sessions for review</span>
                        </li>
                      </ul>
                    </div>

                    {/* In-Person Tutoring */}
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">In-Person Tutoring</h4>
                      <p className="text-gray-600 mb-3">
                        Meet face-to-face with tutors in your area for a personalized learning experience.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>Home or library sessions</span>
                        </li>
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>Physical learning materials</span>
                        </li>
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>Hands-on learning activities</span>
                        </li>
                      </ul>
                    </div>

                    {/* Study Skills & Test Prep */}
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Study Skills & Test Prep</h4>
                      <p className="text-gray-600 mb-3">
                        Master effective study techniques and excel in standardized tests with proven strategies.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>SAT, ACT, and AP exam preparation</span>
                        </li>
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>Memory techniques and note-taking</span>
                        </li>
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>Time management and organization</span>
                        </li>
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>Test-taking strategies and anxiety management</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Counseling Services */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-green-600 px-6 py-4">
                  <h3 className="text-xl font-semibold text-white">
                    Counseling Services
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    Professional guidance for academic planning, college preparation, and career development.
                  </p>
                  
                  <div className="space-y-6">
                    {/* College Counseling */}
                    <div className="border-l-4 border-emerald-500 pl-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">College Counseling</h4>
                      <p className="text-gray-600 mb-3">
                        Expert guidance for college selection, applications, essays, and financial planning.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>College selection strategy</span>
                        </li>
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>Application timeline planning</span>
                        </li>
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>Essay review and editing</span>
                        </li>
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>Financial aid guidance</span>
                        </li>
                      </ul>
                    </div>

                    {/* Academic Counseling */}
                    <div className="border-l-4 border-rose-500 pl-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Academic Counseling</h4>
                      <p className="text-gray-600 mb-3">
                        Personalized academic planning and study strategy development for all grade levels.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>Study skills development</span>
                        </li>
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>Academic goal setting</span>
                        </li>
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>Time management strategies</span>
                        </li>
                        <li className="flex items-start">
                          <span className="h-4 w-4 text-green-500 flex-shrink-0 mr-2">✓</span>
                          <span>Learning style assessment</span>
                        </li>
                      </ul>
                    </div>

                    {/* Session Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Session Details</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Session Duration:</span>
                          <span className="font-medium">30-60 minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Format:</span>
                          <span className="font-medium">Online or In-Person</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Follow-up:</span>
                          <span className="font-medium">Progress tracking included</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
                href="/#subjects"
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
