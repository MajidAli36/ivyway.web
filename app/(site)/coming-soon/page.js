"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  LightBulbIcon,
  BookOpenIcon,
  UserIcon,
  ChevronRightIcon,
  StarIcon,
  BoltIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { waitlist } from "@/app/lib/api/endpoints";

// ...existing imports...

export default function ComingSoon() {
  // Form state management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // Countdown timer state (30-day rolling timer)
  const [timeLeft, setTimeLeft] = useState({
    days: 30,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Function to handle countdown timer
  useEffect(() => {
    // Rolling 30 days from first mount
    const launchDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^[0-9()\-\s+]+$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific error when field is updated
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const userData = {
        fullName: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        message: formData.message,
      };

      await waitlist.add(userData);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      console.error("Waitlist submission error:", err);
      setError(
        err.message ||
          "There was a problem submitting your information. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const aiFeatures = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Interactive AI Chat",
      description:
        "Dedicated chat page where students can ask questions and get instant, intelligent responses with detailed explanations",
    },
    {
      icon: CpuChipIcon,
      title: "Smart Tutoring Assistant",
      description:
        "AI-powered tutoring recommendations and personalized learning paths based on student performance",
    },
    {
      icon: LightBulbIcon,
      title: "Intelligent Problem Solving",
      description:
        "Step-by-step AI explanations for complex problems across all subjects with multiple solution approaches",
    },
    {
      icon: BookOpenIcon,
      title: "Adaptive Learning Plans",
      description:
        "AI creates customized study schedules and curriculum adjustments based on learning patterns and goals",
    },
    {
      icon: UserIcon,
      title: "AI Counseling Support",
      description:
        "Intelligent academic and career guidance with personalized recommendations for college and career paths",
    },
    {
      icon: ChartBarIcon,
      title: "Predictive Analytics",
      description:
        "AI-driven insights into academic performance, identifying strengths, weaknesses, and improvement opportunities",
    },
  ];

  const integrationFeatures = [
    "Real-time AI assistance during live tutoring sessions",
    "Intelligent matching of students with optimal tutors",
    "AI-powered homework help and assignment checking",
    "Smart scheduling and calendar optimization",
    "Automated progress tracking and reporting",
    "Personalized study material recommendations",
    "AI-enhanced teacher tools and resources",
    "Intelligent parent/student communication features",
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-16">
        {/* Hero Section */}
        <section className="px-6 pt-16 pb-12 sm:px-12 lg:px-24 max-w-7xl mx-auto">
          {/* Back Navigation (consistent with Testimonials) */}
          <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0 mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors group"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </Link>
          </div>

          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-medium mb-6">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Powered by Advanced AI Technology
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                IvyWay AI
              </span>
              <br />
              <span className="text-gray-700">Coming Soon</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              The future of education is here. Experience revolutionary
              AI-powered tutoring, personalized learning, and intelligent
              academic support that adapts to every student's unique needs.
            </p>

            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              <div className="text-center">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all hover:scale-105 hover:shadow-2xl">
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <p className="text-gray-500 text-sm font-medium mt-2">Days</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all hover:scale-105 hover:shadow-2xl">
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <p className="text-gray-500 text-sm font-medium mt-2">
                    Hours
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all hover:scale-105 hover:shadow-2xl">
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <p className="text-gray-500 text-sm font-medium mt-2">
                    Minutes
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all hover:scale-105 hover:shadow-2xl">
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <p className="text-gray-500 text-sm font-medium mt-2">
                    Seconds
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-sm italic bg-blue-50 py-3 px-6 rounded-full inline-block border border-blue-200">
                <BoltIcon className="inline h-4 w-4 mr-2" />
                Launch timeline may be adjusted for optimal user experience
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - AI Features */}
            <div className="space-y-12">
              {/* AI Features Section */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                  <SparklesIcon className="h-8 w-8 text-blue-600 mr-3" />
                  Revolutionary AI Features
                </h2>

                <div className="space-y-6">
                  {aiFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                            <feature.icon className="h-6 w-6" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integration Highlight */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <CpuChipIcon className="h-7 w-7 mr-3" />
                  Fully Integrated AI Experience
                </h3>
                <p className="text-blue-100 mb-6 text-lg">
                  Our AI isn't just a separate tool – it's seamlessly woven into
                  every aspect of the platform:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {integrationFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center text-blue-50">
                      <ChevronRightIcon className="h-4 w-4 mr-2 text-blue-300" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Chat Highlight */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-200">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white mb-4">
                    <ChatBubbleLeftRightIcon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Interactive AI Chat Page
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Get instant, intelligent responses to any academic question.
                    Our AI provides detailed explanations, step-by-step
                    solutions, and personalized learning recommendations through
                    an intuitive chat interface.
                  </p>
                  <div className="flex items-center justify-center mt-6 space-x-2">
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-500 ml-2">
                      AI-Powered Excellence
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
                {!isSubmitted ? (
                  <>
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Get Exclusive Early Access
                      </h2>
                      <p className="text-gray-600 text-lg">
                        Be among the first to experience the future of
                        AI-powered education. Join our waitlist for premium
                        early access benefits.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className={`block w-full rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-4 pl-4 pr-4 border-2 transition-all ${
                              formErrors.name
                                ? "border-red-500"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            placeholder="Enter your full name"
                          />
                          {formErrors.name && (
                            <p className="mt-2 text-sm text-red-600">
                              {formErrors.name}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className={`block w-full rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-4 pl-4 pr-4 border-2 transition-all ${
                              formErrors.email
                                ? "border-red-500"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            placeholder="you@example.com"
                          />
                          {formErrors.email && (
                            <p className="mt-2 text-sm text-red-600">
                              {formErrors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`block w-full rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-4 pl-4 pr-4 border-2 transition-all ${
                              formErrors.phone
                                ? "border-red-500"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            placeholder="(123) 456-7890"
                          />
                          {formErrors.phone && (
                            <p className="mt-2 text-sm text-red-600">
                              {formErrors.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Tell us about your needs (Optional)
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows="4"
                          value={formData.message}
                          onChange={handleChange}
                          className="block w-full rounded-xl border-2 border-gray-200 hover:border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-4 px-4 resize-none transition-all"
                          placeholder="What subjects or areas would you like AI assistance with?"
                        ></textarea>
                      </div>

                      {error && (
                        <div className="text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 font-semibold text-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <ArrowPathIcon className="h-5 w-5 mr-3 animate-spin" />
                            Joining Waitlist...
                          </>
                        ) : (
                          <>
                            <SparklesIcon className="h-5 w-5 mr-3" />
                            Join the AI Revolution
                          </>
                        )}
                      </button>

                      <p className="text-xs text-gray-500 text-center mt-4">
                        By joining, you'll receive exclusive updates and early
                        access to revolutionary AI features.
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                      <CheckCircleIcon className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      Welcome to the Future!
                    </h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      You're now on the exclusive waitlist for IvyWay AI. We'll
                      notify you as soon as our revolutionary platform launches.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          message: "",
                        });
                      }}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                    >
                      Back to Form
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
