"use client";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import ReactAIWidget from "../../components/ai-chat/ReactAIWidget";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <div className="pt-32 pb-20">
        {/* Back Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
              <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors group"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Home
              </Link>
        </div>

        <TestimonialsSection />
        </div>
      <Footer />

      {/* AI Widget */}
      <ReactAIWidget userRole="visitor" position="bottom-right" />
    </div>
  );
}