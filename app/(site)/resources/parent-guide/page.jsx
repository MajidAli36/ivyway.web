"use client";

import Link from "next/link";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";

// Parent guide sections
const parentGuides = [
  {
    id: "supporting-students",
    title: "Supporting Your Student",
    resources: [
      {
        title: "Creating an Effective Study Environment",
        description:
          "Learn how to set up a distraction-free space that promotes focus and learning.",
      },
      {
        title: "Balancing Academics and Extracurriculars",
        description:
          "Tips for helping your child manage their time between school, activities, and rest.",
      },
      {
        title: "Recognizing and Addressing Learning Challenges",
        description:
          "Signs that your child might be struggling and when to seek additional support.",
      },
    ],
  },
  {
    id: "academic-coaching",
    title: "Academic Coaching for Parents",
    resources: [
      {
        title: "How to Check Homework Without Doing It For Them",
        description:
          "Strategies to support independence while ensuring understanding.",
      },
      {
        title: "Effective Communication with Teachers",
        description:
          "Building productive partnerships with your child's educational team.",
      },
      {
        title: "Motivating Without Pressuring",
        description:
          "Foster intrinsic motivation and a love of learning without creating anxiety.",
      },
    ],
  },
  {
    id: "tutoring-support",
    title: "Maximizing Tutoring Benefits",
    resources: [
      {
        title: "When to Consider Tutoring",
        description:
          "Signs that your child might benefit from one-on-one academic support.",
      },
      {
        title: "Choosing the Right Tutor",
        description:
          "What to look for in a tutor to ensure the best match for your child.",
      },
      {
        title: "Supporting the Tutoring Process",
        description:
          "How to reinforce concepts between sessions and track progress.",
      },
    ],
  },
];

// FAQ items
const faqs = [
  {
    question: "How do I know if my child needs a tutor?",
    answer:
      "Consider tutoring if you notice: persistent struggles with specific subjects, decreased confidence in academic abilities, resistance to homework, declining grades, or if your child expresses a desire for additional help. Tutoring can be beneficial both remedially and for enrichment purposes.",
  },
  {
    question: "How often should my child meet with a tutor?",
    answer:
      "The frequency depends on your child's needs and goals. For addressing significant academic challenges, we typically recommend 2-3 sessions per week. For maintenance or enrichment, once a week may be sufficient. Your IvyWay academic advisor can help determine the optimal schedule.",
  },
  {
    question: "How can I monitor progress without micromanaging?",
    answer:
      "Focus on growth rather than just grades. Schedule regular check-ins with your child's tutor to discuss progress, areas of improvement, and upcoming goals. Ask your child open-ended questions about what they're learning and what they find challenging. Trust the process and celebrate incremental improvements.",
  },
  {
    question: "What's the difference between tutoring and homework help?",
    answer:
      "Homework help addresses immediate assignments, while comprehensive tutoring builds foundational understanding and learning skills. At IvyWay, our tutors help with current homework while identifying and addressing underlying knowledge gaps and teaching strategies for long-term academic success.",
  },
  {
    question: "How involved should I be in the tutoring process?",
    answer:
      "Your role is to provide support while encouraging independence. Be available for questions and maintain open communication with the tutor, but allow your child and the tutor to develop their working relationship. Provide feedback to the tutor about any observations or concerns, and reinforce consistent study habits between sessions.",
  },
];

export default function ParentGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section - Updated to match consistent blue gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold sm:text-5xl sm:tracking-tight lg:text-6xl">
                Parent Resources
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
                Helping you support your child's academic journey with
                confidence.
              </p>
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Your Role in Academic Success
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                As a parent, you play a critical role in your child's education.
                Your involvement, encouragement, and support create the
                foundation for their academic confidence and success.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                These resources are designed to help you navigate your child's
                educational journey, from establishing effective study habits to
                partnering with tutors and teachers.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="#supporting-students"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Supporting Your Student
                </Link>
                <Link
                  href="#academic-coaching"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  Academic Coaching
                </Link>
                <Link
                  href="#tutoring-support"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  Tutoring Benefits
                </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="bg-blue-50 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Parent Webinar Series
                </h3>
                <p className="text-gray-600 mb-6">
                  Join our free monthly webinars covering essential topics for
                  supporting your student's academic journey. Each session
                  includes Q&A with education experts.
                </p>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="font-medium text-gray-900">
                      May 15, 2025 • 7:00 PM
                    </p>
                    <p className="text-gray-700">
                      Developing Executive Function Skills
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="font-medium text-gray-900">
                      June 12, 2025 • 7:00 PM
                    </p>
                    <p className="text-gray-700">
                      Summer Learning: Preventing Academic Slide
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parent Guide Sections */}
        {parentGuides.map((section) => (
          <div
            key={section.id}
            id={section.id}
            className="py-16 even:bg-white odd:bg-blue-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                {section.title}
              </h2>

              <div className="grid gap-8 md:grid-cols-3">
                {section.resources.map((resource, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600">{resource.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Downloadable Resources */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Free Downloadable Resources
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Homework Checklist",
              "Parent-Teacher Conference Guide",
              "Weekly Study Planner",
              "Academic Goal Setting Worksheet",
            ].map((resource, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                    <span className="text-xl">📄</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {resource}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Downloadable PDF to help you support your student's academic
                    journey.
                  </p>
                  <button
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 w-full cursor-not-allowed"
                    disabled
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Advice */}
        <div className="bg-gray-900 py-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Expert Advice for Parents
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 mb-6"></div>
                <h3 className="text-xl font-semibold mb-3">Dr. Sarah Chen</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Educational Psychologist
                </p>
                <blockquote className="italic text-gray-300">
                  "The most powerful way to support your child's education is to
                  cultivate curiosity. Ask questions about what they're
                  learning, show genuine interest, and model a love of learning
                  in your own life."
                </blockquote>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 mb-6"></div>
                <h3 className="text-xl font-semibold mb-3">Marcus Williams</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Study Skills Specialist
                </p>
                <blockquote className="italic text-gray-300">
                  "Organization is the foundation of academic success. Help your
                  child develop systems for tracking assignments, managing
                  materials, and planning study time that work with their
                  natural tendencies."
                </blockquote>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 mb-6"></div>
                <h3 className="text-xl font-semibold mb-3">
                  Dr. Maria Rodriguez
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Child Development Researcher
                </p>
                <blockquote className="italic text-gray-300">
                  "Remember that academic growth isn't linear. Periods of
                  plateau or even temporary regression are normal parts of
                  learning. Focus on long-term progress rather than short-term
                  performance."
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

          <div className="space-y-6 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-4">
              Have a question that's not answered here?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Contact Our Parent Support Team
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Support Your Child's Academic Success?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
              Our tutors work as partners with parents to provide personalized
              academic support.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
              >
                Get Started
              </Link>
              <Link
                href="/contact"
                className="ml-4 inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
