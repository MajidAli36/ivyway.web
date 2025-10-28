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

        {/* Founders Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Our Founders
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
                Meet the visionaries who founded IvyWay to transform education through technology and personalized learning.
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
              {/* O'Neal - Founder */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <div className="h-64 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold">O</span>
                    </div>
                    <h3 className="text-2xl font-bold">O'Neal</h3>
                    <p className="text-blue-100">Co-Founder</p>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    O'Neal
                  </h3>
                  <p className="text-blue-600 font-semibold mb-4">Co-Founder</p>
                  <p className="text-gray-600 leading-relaxed">
                    Visionary leader with a passion for educational innovation. O'Neal founded IvyWay with the mission to make quality education accessible to all students through personalized tutoring and cutting-edge technology.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                      Education Innovation
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                      Strategic Leadership
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                      Technology Vision
                    </span>
                  </div>
                </div>
              </div>

              {/* Matthew - Founder */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <div className="h-64 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold">M</span>
                    </div>
                    <h3 className="text-2xl font-bold">Matthew</h3>
                    <p className="text-green-100">Co-Founder</p>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Matthew
                  </h3>
                  <p className="text-green-600 font-semibold mb-4">Co-Founder</p>
                  <p className="text-gray-600 leading-relaxed">
                    Technology expert and educational advocate. Matthew leads the technical development of IvyWay's platform, ensuring seamless user experiences and innovative features that enhance the learning process.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                      Technology Leadership
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                      Platform Development
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                      Innovation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Development Team Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Our Development Team
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
                The talented developers who bring IvyWay's vision to life through innovative technology solutions.
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
              {/* Ahsan - Developer */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <div className="h-64 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold">A</span>
                    </div>
                    <h3 className="text-2xl font-bold">Ahsan</h3>
                    <p className="text-purple-100">Lead Developer</p>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Ahsan
                  </h3>
                  <p className="text-purple-600 font-semibold mb-4">Lead Developer</p>
                  <p className="text-gray-600 leading-relaxed">
                    Full-stack developer with expertise in modern web technologies. Ahsan leads the development of IvyWay's core platform features, ensuring robust performance and exceptional user experience.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium">
                      Full-Stack Development
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium">
                      Platform Architecture
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium">
                      User Experience
                    </span>
                  </div>
                </div>
              </div>

              {/* Majid - Developer */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <div className="h-64 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold">M</span>
                    </div>
                    <h3 className="text-2xl font-bold">Majid</h3>
                    <p className="text-orange-100">Senior Developer</p>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Majid
                  </h3>
                  <p className="text-orange-600 font-semibold mb-4">Senior Developer</p>
                  <p className="text-gray-600 leading-relaxed">
                    Experienced developer specializing in scalable solutions and system optimization. Majid contributes to IvyWay's technical excellence through innovative coding practices and performance optimization.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full font-medium">
                      System Optimization
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full font-medium">
                      Scalable Solutions
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full font-medium">
                      Performance
                    </span>
                  </div>
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
