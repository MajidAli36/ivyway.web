"use client";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ReactAIWidget from "../../components/ai-chat/ReactAIWidget";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                About IvyWay
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
                Transforming education through personalized tutoring and
                academic excellence.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              <p className="mt-4 text-lg text-gray-600">
                At IvyWay, we believe every student deserves access to
                exceptional education. Our mission is to connect students with
                expert tutors who can guide them toward academic success and
                build lasting confidence in their abilities.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Through personalized learning plans, innovative technology, and
                passionate educators, we're reimagining tutoring for the modern
                student.
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="bg-blue-100 rounded-xl p-8 h-full flex items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-blue-800 mb-4">
                    Our Values
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                          1
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700">
                        Excellence in education
                      </p>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                          2
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700">
                        Personalized attention
                      </p>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                          3
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700">
                        Accessibility for all learners
                      </p>
                    </li>
                    <li className="flex">
                      <div className="flex-shrink-0">
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                          4
                        </div>
                      </div>
                      <p className="ml-3 text-gray-700">
                        Building lasting confidence
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Our Leadership Team
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
                Meet the dedicated educators and innovators behind IvyWay.
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Team Member 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-blue-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Sarah Johnson
                  </h3>
                  <p className="text-blue-600">Founder & CEO</p>
                  <p className="mt-3 text-gray-600">
                    Former educator with 15+ years experience. Stanford
                    University graduate.
                  </p>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-blue-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Michael Chen
                  </h3>
                  <p className="text-blue-600">Chief Academic Officer</p>
                  <p className="mt-3 text-gray-600">
                    PhD in Education. Previously led curriculum development at
                    top universities.
                  </p>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-blue-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Amara Williams
                  </h3>
                  <p className="text-blue-600">Head of Tutor Success</p>
                  <p className="mt-3 text-gray-600">
                    Education innovator focused on tutor development and student
                    outcomes.
                  </p>
                </div>
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
