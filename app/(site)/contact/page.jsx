"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ReactAIWidget from "../../components/ai-chat/ReactAIWidget";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setSubmitting(false);
      setSubmitted(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl">
          Have questions about our tutoring services? Our team is here to help
          you find the perfect learning solution.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Thank You!
                </h2>
                <p className="text-gray-600">
                  Your message has been received. We'll get back to you as soon
                  as possible.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-xl p-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      submitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div>
            <div className="bg-white shadow-md rounded-xl p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Contact Information
              </h3>
              <ul className="space-y-4">
                <li className="flex">
                  <EnvelopeIcon className="h-6 w-6 text-blue-500 flex-shrink-0 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a
                      href="mailto:contact@ivywayedu.com"
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      contact@ivywayedu.com
                    </a>
                  </div>
                </li>
                <li className="flex">
                  <PhoneIcon className="h-6 w-6 text-blue-500 flex-shrink-0 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <a
                      href="tel:+17035652977"
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      +1 (703) 565-2977
                    </a>
                  </div>
                </li>
                <li className="flex">
                  <MapPinIcon className="h-6 w-6 text-blue-500 flex-shrink-0 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Coming Soon
                    </p>
                    <p className="text-sm text-gray-600">
                      Our offices are coming soon in:
                      <br />
                      <span className="text-blue-600">• United States</span>
                      <br />
                      <span className="text-blue-600">
                        • United Arab Emirates
                      </span>
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  <strong>Note:</strong> We're expanding! Stay tuned for our
                  office locations in the United States and UAE.
                </p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Operating Hours
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Monday - Friday</span>
                  <span className="text-sm font-medium text-gray-900">
                    9:00 AM - 6:00 PM
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Saturday</span>
                  <span className="text-sm font-medium text-gray-900">
                    10:00 AM - 4:00 PM
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Sunday</span>
                  <span className="text-sm font-medium text-gray-900">
                    Closed
                  </span>
                </li>
              </ul>
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
