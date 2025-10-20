"use client";

import Link from "next/link";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";

// Sample study tips categories
const studyTipCategories = [
  {
    id: "time-management",
    title: "Time Management",
    icon: "⏰",
    tips: [
      {
        title: "The Pomodoro Technique",
        description:
          "Study in focused 25-minute intervals with 5-minute breaks in between. After 4 intervals, take a longer 15-30 minute break.",
        steps: [
          "Set a timer for 25 minutes",
          "Work with full focus until the timer rings",
          "Take a 5-minute break",
          "Repeat 4 times, then take a longer break",
        ],
      },
      {
        title: "Weekly Planning",
        description:
          "Create a weekly schedule that allocates specific time blocks for studying different subjects.",
        steps: [
          "Identify your weekly commitments",
          "Determine your most productive hours",
          "Schedule study blocks of 1-2 hours",
          "Assign specific subjects to each block",
          "Include buffer time for unexpected events",
        ],
      },
      {
        title: "Task Prioritization",
        description:
          "Use the Eisenhower Matrix to categorize tasks by urgency and importance.",
        steps: [
          "List all your tasks",
          "Categorize as: Important & Urgent, Important & Not Urgent, Not Important & Urgent, or Not Important & Not Urgent",
          "Focus first on Important & Urgent tasks",
          "Schedule time for Important & Not Urgent tasks",
          "Delegate or minimize Not Important & Urgent tasks",
          "Eliminate Not Important & Not Urgent tasks",
        ],
      },
    ],
  },
  {
    id: "note-taking",
    title: "Effective Note-Taking",
    icon: "📝",
    tips: [
      {
        title: "Cornell Method",
        description:
          "Divide your paper into sections for notes, questions, and summary to organize information effectively.",
        steps: [
          "Divide your page into three sections: notes (right), cues (left), and summary (bottom)",
          "Take notes in the right column during class",
          "Write questions in the left column after class",
          "Write a summary at the bottom of the page",
          "Use the questions to test yourself when studying",
        ],
      },
      {
        title: "Mind Mapping",
        description:
          "Create visual diagrams that connect concepts and ideas around a central theme.",
        steps: [
          "Write the main topic in the center of the page",
          "Draw branches extending from the center for major subtopics",
          "Add smaller branches for details",
          "Use colors, symbols, and images to enhance memory",
          "Review and revise your mind map regularly",
        ],
      },
      {
        title: "Active Listening",
        description:
          "Engage actively during lectures to improve comprehension and retention.",
        steps: [
          "Preview material before class",
          "Focus on understanding, not just recording",
          "Note key concepts and supporting details",
          "Use abbreviations and symbols for efficiency",
          "Review and organize notes within 24 hours",
        ],
      },
    ],
  },
  {
    id: "memory-techniques",
    title: "Memory Techniques",
    icon: "🧠",
    tips: [
      {
        title: "Spaced Repetition",
        description:
          "Review information at increasing intervals to strengthen long-term memory.",
        steps: [
          "Study new information",
          "Review after 1 day",
          "Review again after 3 days",
          "Then after 1 week",
          "Then after 2 weeks",
          "Continue increasing intervals",
        ],
      },
      {
        title: "Method of Loci",
        description:
          "Associate information with locations in a familiar place to improve recall.",
        steps: [
          "Choose a familiar route or location",
          "Create vivid, unusual mental images for the information",
          "Place these images at specific points along your route",
          "To recall, mentally walk through the location",
          "Practice regularly to strengthen associations",
        ],
      },
      {
        title: "Chunking",
        description:
          "Group information into manageable chunks to increase memory capacity.",
        steps: [
          "Break down complex information into smaller units",
          "Identify patterns or connections between items",
          "Group items into 5-9 chunks",
          "Create meaningful associations within each chunk",
          "Practice recalling the chunks",
        ],
      },
    ],
  },
];

export default function StudyTipsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold sm:text-5xl sm:tracking-tight lg:text-6xl">
                Study Tips & Techniques
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
                Evidence-based strategies to help you study smarter, not harder.
              </p>
            </div>
          </div>
        </div>

        {/* Study Tips Overview */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our tutors have compiled these research-backed study techniques to
              help you maximize your learning potential. Find the methods that
              work best for your learning style and academic goals.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {studyTipCategories.map((category) => (
              <Link
                key={category.id}
                href={`#${category.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                <div className="p-6 text-center">
                  <span className="text-4xl mb-4 block">{category.icon}</span>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {category.title}
                  </h2>
                  <p className="mt-2 text-gray-600">
                    {category.tips.length} proven techniques
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Study Tips Categories */}
        {studyTipCategories.map((category) => (
          <div key={category.id} id={category.id} className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <span className="text-5xl mb-4 block">{category.icon}</span>
                <h2 className="text-3xl font-bold text-gray-900">
                  {category.title}
                </h2>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {category.tips.map((tip, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {tip.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{tip.description}</p>

                      <h4 className="font-medium text-gray-900 mb-2">
                        How to use it:
                      </h4>
                      <ol className="space-y-2 pl-5 list-decimal">
                        {tip.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-gray-700">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* More Study Resources */}
        <div className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Additional Resources
            </h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                    <span className="text-xl">📚</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Recommended Books
                  </h3>
                  <p className="text-gray-600">
                    Explore our curated collection of books on effective
                    learning strategies.
                  </p>
                  <Link
                    href="/resources/recommended-books"
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    View Book List
                    <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                    <span className="text-xl">🎬</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Video Tutorials
                  </h3>
                  <p className="text-gray-600">
                    Watch instructional videos demonstrating effective study
                    techniques.
                  </p>
                  <Link
                    href="/resources/video-tutorials"
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Watch Videos
                    <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                    <span className="text-xl">📋</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Study Planners
                  </h3>
                  <p className="text-gray-600">
                    Download free study planners and templates to organize your
                    study sessions.
                  </p>
                  <Link
                    href="/resources/study-planners"
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Download Templates
                    <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mb-4">
                    <span className="text-xl">💡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Subject-Specific Tips
                  </h3>
                  <p className="text-gray-600">
                    Discover specialized study techniques for different academic
                    subjects.
                  </p>
                  <Link
                    href="/resources/subject-tips"
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Explore by Subject
                    <span className="ml-1">→</span>
                  </Link>
                </div>
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
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  How long should I study each day?
                </h3>
                <p className="mt-2 text-gray-600">
                  Quality matters more than quantity. Research suggests that
                  30-50 minute focused study sessions with short breaks are more
                  effective than marathon study sessions. Most high school
                  students benefit from 2-3 hours of focused study per day,
                  while college students might need 3-4 hours depending on their
                  course load.
                </p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  What's the best time of day to study?
                </h3>
                <p className="mt-2 text-gray-600">
                  This varies based on individual circadian rhythms. Some people
                  are more alert in the morning, while others peak in the
                  afternoon or evening. Pay attention to when you feel most
                  mentally sharp and schedule your most challenging subjects
                  during these times. Consistency is key – studying at the same
                  times each day helps train your brain for optimal performance.
                </p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Should I listen to music while studying?
                </h3>
                <p className="mt-2 text-gray-600">
                  It depends on your learning style and the type of music.
                  Instrumental music at a moderate volume can help some students
                  focus by masking distracting background noise. However, music
                  with lyrics can compete for your verbal processing resources
                  and reduce comprehension when reading or writing. Experiment
                  to find what works best for you, but consider silence or
                  ambient sounds for complex material.
                </p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  How can I stay motivated to study?
                </h3>
                <p className="mt-2 text-gray-600">
                  Set specific, achievable goals for each study session. Break
                  large tasks into smaller milestones and reward yourself when
                  you reach them. Connect your studies to your larger life goals
                  and remember why the material matters. Study with friends when
                  appropriate, as social accountability can increase motivation.
                  If you find yourself consistently procrastinating, it might
                  help to work with a tutor who can provide structure and
                  encouragement.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">
              Need Personalized Study Guidance?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
              Our tutors can help you develop a customized study plan tailored
              to your learning style and academic goals.
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
