"use client";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function PricingSection() {
  const [selectedService, setSelectedService] = useState("tutoring");
  const [showTutoringDetails, setShowTutoringDetails] = useState(true);
  const [showCounselingDetails, setShowCounselingDetails] = useState(false);
  const [showTestPrepDetails, setShowTestPrepDetails] = useState(false);
  const [showToursDetails, setShowToursDetails] = useState(false);
  const [showIWGSPDetails, setShowIWGSPDetails] = useState(false);

  // Pricing updated per request

  const handleServiceSelection = (service) => {
    setSelectedService(service);
    setShowTutoringDetails(service === "tutoring");
    setShowCounselingDetails(service === "counseling");
    setShowTestPrepDetails(service === "testprep");
    setShowToursDetails(service === "tours");
    setShowIWGSPDetails(service === "iwgsp");
  };

  return (
    <section
      id="pricing"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-slate-800">
          Transparent Pricing Options
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Choose the plan that works best for your educational goals and budget
        </p>
      </div>

      {/* Service Selection Navigation */}
      <div className="mb-12 border-b border-gray-200">
        <div className="flex flex-wrap -mb-px">
          <button
            onClick={() => handleServiceSelection("tutoring")}
            className={`mr-2 inline-block p-4 rounded-t-lg ${
              selectedService === "tutoring"
                ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
            }`}
          >
            Tutoring Services
          </button>
          <button
            onClick={() => handleServiceSelection("counseling")}
            className={`mr-2 inline-block p-4 rounded-t-lg ${
              selectedService === "counseling"
                ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
            }`}
          >
            College Counseling
          </button>
          <button
            onClick={() => handleServiceSelection("testprep")}
            className={`mr-2 inline-block p-4 rounded-t-lg ${
              selectedService === "testprep"
                ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
            }`}
          >
            Test Prep
          </button>
          <button
            onClick={() => handleServiceSelection("tours")}
            className={`mr-2 inline-block p-4 rounded-t-lg ${
              selectedService === "tours"
                ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
            }`}
          >
            Virtual College Tours
          </button>
          <button
            onClick={() => handleServiceSelection("iwgsp")}
            className={`mr-2 inline-block p-4 rounded-t-lg ${
              selectedService === "iwgsp"
                ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
            }`}
          >
            IvyWay Global Student Program
          </button>
        </div>
      </div>

      {/* Tutoring Services Section */}
      {showTutoringDetails && (
        <div className="bg-white rounded-xl p-8 shadow-lg border border-blue-100">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">
            Tutoring Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-8 shadow-md border border-blue-100 flex flex-col h-full min-h-[300px] md:min-h-[340px]">
              <div className="text-lg font-bold text-slate-800">
                Single Tutoring Session
              </div>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-bold text-slate-800">
                  $74.99
                </span>
              </div>
              <p className="mt-2 text-slate-600">1-on-1 session</p>
              <div className="mt-auto">
                <Link href="/coming-soon">
                  <button className="w-full py-3 rounded-full font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-md border border-blue-100 flex flex-col h-full min-h-[300px] md:min-h-[340px]">
              <div className="text-lg font-bold text-slate-800">
                Monthly Tutoring Package
              </div>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-bold text-slate-800">
                  $249.99
                </span>
              </div>
              <p className="mt-2 text-slate-600">Bundle and save</p>
              <div className="mt-auto">
                <Link href="/coming-soon">
                  <button className="w-full py-3 rounded-full font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all">
                    Choose Package
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-md border border-blue-100 flex flex-col h-full min-h-[300px] md:min-h-[340px]">
              <div className="text-lg font-bold text-slate-800">
                Single Advanced Tutoring Session
              </div>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-bold text-slate-800">
                  $99.99
                </span>
              </div>
              <p className="mt-2 text-slate-600">AP/IB and college-level</p>
              <div className="mt-auto">
                <Link href="/coming-soon">
                  <button className="w-full py-3 rounded-full font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-md border border-blue-100 flex flex-col h-full min-h-[300px] md:min-h-[340px]">
              <div className="text-lg font-bold text-slate-800">
                Monthly Advanced Tutoring Package
              </div>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-bold text-slate-800">
                  $349.99
                </span>
              </div>
              <p className="mt-2 text-slate-600">Advanced bundle</p>
              <div className="mt-auto">
                <Link href="/coming-soon">
                  <button className="w-full py-3 rounded-full font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all">
                    Choose Package
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Prep Section */}
      {showTestPrepDetails && (
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-blue-100">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">
            Test Preparation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-blue-100 flex flex-col h-full min-h-[260px] sm:min-h-[300px]">
              <div className="text-base sm:text-lg font-bold text-slate-800">
                Single Session (1hr)
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-2xl sm:text-3xl font-bold text-slate-800">
                  $149.99
                </span>
              </div>
              <p className="mt-1 text-sm sm:text-base text-slate-600">One-time test prep session</p>
              <div className="mt-auto">
                <Link href="/coming-soon">
                  <button className="w-full py-2 sm:py-3 rounded-full font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all text-sm sm:text-base">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-blue-100 flex flex-col h-full min-h-[260px] sm:min-h-[300px]">
              <div className="text-base sm:text-lg font-bold text-slate-800">
                Two-Session Monthly Deal (2hr total)
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-2xl sm:text-3xl font-bold text-slate-800">
                  $269.99
                </span>
              </div>
              <p className="mt-1 text-sm sm:text-base text-slate-600">2 hours of test prep</p>
              <div className="mt-auto">
                <Link href="/coming-soon">
                  <button className="w-full py-2 sm:py-3 rounded-full font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all text-sm sm:text-base">
                    Choose Deal
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-blue-100 flex flex-col h-full min-h-[260px] sm:min-h-[300px]">
              <div className="text-base sm:text-lg font-bold text-slate-800">
                Four-Session Monthly Bundle (4hr total)
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-2xl sm:text-3xl font-bold text-slate-800">
                  $499.99
                </span>
              </div>
              <p className="mt-1 text-sm sm:text-base text-slate-600">4 hours of test prep</p>
              <div className="mt-auto">
                <Link href="/coming-soon">
                  <button className="w-full py-2 sm:py-3 rounded-full font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all text-sm sm:text-base">
                    Choose Bundle
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-blue-100 flex flex-col h-full min-h-[260px] sm:min-h-[300px]">
              <div className="text-base sm:text-lg font-bold text-slate-800">
                Ten-Session Premium Bundle (10hr total)
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-2xl sm:text-3xl font-bold text-slate-800">
                  $1,199.99
                </span>
              </div>
              <p className="mt-1 text-sm sm:text-base text-slate-600">10 hours of test prep</p>
              <div className="mt-auto">
                <Link href="/coming-soon">
                  <button className="w-full py-2 sm:py-3 rounded-full font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all text-sm sm:text-base">
                    Choose Premium
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Virtual College Tours Section */}
      {showToursDetails && (
        <div className="bg-white rounded-xl p-8 shadow-lg border border-blue-100">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">
            Virtual College Tours
          </h3>
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-md border border-blue-100 transition-all hover:shadow-lg">
              <div className="text-xl font-bold text-slate-800">
                Virtual College Tours
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-slate-800">
                  Starting from $124.99
                </span>
              </div>
              <p className="mt-2 text-slate-500">
                Live 1:1 virtual campus tours
              </p>
              <div className="mt-8">
                <Link href="/coming-soon">
                  <button className="w-full py-3 rounded-full font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all">
                    Book Virtual Tour
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* College Counseling Section */}
      {showCounselingDetails && (
        <div className="bg-white rounded-xl p-8 shadow-lg border border-blue-100">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">
            College Counseling
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-10 shadow-md border border-blue-100 transition-all hover:shadow-lg flex flex-col h-full min-h-[320px] md:min-h-[360px]">
              <div className="text-xl font-bold text-slate-800">
                Single Counseling Session (30 min)
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-slate-800">
                  $49.99
                </span>
              </div>
              <p className="mt-2 text-slate-500">Focused 30-minute guidance</p>
              <div className="mt-auto">
                <Link href="/coming-soon">
                  <button className="w-full py-3 rounded-full font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-xl p-10 shadow-md border border-blue-100 transition-all hover:shadow-lg flex flex-col h-full min-h-[320px] md:min-h-[360px]">
              <div className="text-xl font-bold text-slate-800">
                Single Counseling Session (60 min)
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-slate-800">
                  $89.99
                </span>
              </div>
              <p className="mt-2 text-slate-500">Deep-dive 60-minute session</p>
              <div className="mt-auto">
                <Link href="/coming-soon">
                  <button className="w-full py-3 rounded-full font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-xl p-10 shadow-md border border-blue-100 transition-all hover:shadow-lg flex flex-col h-full min-h-[320px] md:min-h-[360px]">
              <div className="text-xl font-bold text-slate-800">
                Monthly Counseling (2×30 min)
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-slate-800">
                  $89.99
                </span>
              </div>
              <p className="mt-2 text-slate-500">
                Two 30-minute sessions monthly
              </p>
              <div className="mt-auto">
                <Link href="/coming-soon">
                  <button className="w-full py-3 rounded-full font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all">
                    Choose Plan
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-xl p-10 shadow-md border border-blue-100 transition-all hover:shadow-lg flex flex-col h-full min-h-[320px] md:min-h-[360px]">
              <div className="text-xl font-bold text-slate-800">
                Monthly Counseling (2×60 min)
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-slate-800">
                  $159.99
                </span>
              </div>
              <p className="mt-2 text-slate-500">
                Two 60-minute sessions monthly
              </p>
              <div className="mt-auto">
                <Link href="/coming-soon">
                  <button className="w-full py-3 rounded-full font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all">
                    Choose Plan
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IWGSP Section */}
      {showIWGSPDetails && (
        <div className="bg-white rounded-xl p-8 shadow-lg border border-blue-100">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            IvyWay Global Student Program (IWGSP)
          </h3>
          <p className="text-slate-600 mb-8">
            Designed to help international students who want to study in the
            U.S. We provide college admissions assistance, visa guidance,
            cultural adaptation support, and tutoring services to help students
            transition successfully.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-md border border-blue-100 transition-all hover:shadow-lg">
              <div className="text-xl font-bold text-slate-800">IWGSP</div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-slate-800">
                  Starting from $99.99
                </span>
              </div>
              <p className="mt-2 text-slate-500">
                Support for international students
              </p>
              <div className="mt-8">
                <Link href="/coming-soon">
                  <button className="w-full py-3 rounded-full font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
