"use client";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import TrustedBySection from "../components/home/TrustedBySection";
import FeaturesSection from "../components/home/FeaturesSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import SubjectsSection from "../components/home/SubjectsSection";
import PricingSection from "../components/PricingSection";
import CTASection from "../components/home/CTASection";
import ReactAIWidget from "../components/ai-chat/ReactAIWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <HowItWorksSection />
      <SubjectsSection />
      <PricingSection />
      <CTASection />
      <Footer />

      {/* AI Widget */}
      <ReactAIWidget userRole="visitor" position="bottom-right" />
    </div>
  );
}
