import { CheckCircleIcon, ArrowRightIcon, AcademicCapIcon, UserGroupIcon, BookOpenIcon, CalculatorIcon, BeakerIcon, GlobeAltIcon, CodeBracketIcon, LanguageIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import Button from "../shared/Button";
import SectionTitle from "../shared/SectionTitle";
import { ENHANCED_SUBJECTS } from "../../constants/enhancedSubjects";

export default function SubjectsSection() {
  // Enhanced subject data with detailed descriptions and topics
  const tutoringSubjects = [
    {
      name: "Mathematics",
      icon: CalculatorIcon,
      color: "blue",
      description: "From basic arithmetic to advanced calculus, we cover all mathematical concepts",
      topics: ["Algebra", "Geometry", "Calculus", "Statistics", "Trigonometry", "Pre-Calculus"],
      gradeLevels: "K-12 & College",
      popularTopics: ["AP Calculus", "SAT Math", "Algebra II", "Statistics"]
    },
    {
      name: "Science",
      icon: BeakerIcon,
      color: "green",
      description: "Comprehensive science education across all disciplines",
      topics: ["Biology", "Chemistry", "Physics", "Earth Science", "Environmental Science"],
      gradeLevels: "K-12 & College",
      popularTopics: ["AP Biology", "AP Chemistry", "AP Physics", "Organic Chemistry"]
    },
    {
      name: "English & Language Arts",
      icon: BookOpenIcon,
      color: "purple",
      description: "Reading, writing, and critical thinking skills development",
      topics: ["Literature", "Writing", "Grammar", "Reading Comprehension", "Essay Writing"],
      gradeLevels: "K-12 & College",
      popularTopics: ["AP English", "SAT Reading", "College Essays", "Creative Writing"]
    },
    {
      name: "History & Social Studies",
      icon: GlobeAltIcon,
      color: "red",
      description: "Understanding our world through historical and social perspectives",
      topics: ["World History", "US History", "Geography", "Economics", "Political Science"],
      gradeLevels: "K-12 & College",
      popularTopics: ["AP World History", "AP US History", "AP Human Geography", "Government"]
    },
    {
      name: "Foreign Languages",
      icon: LanguageIcon,
      color: "yellow",
      description: "Master new languages with native and certified instructors",
      topics: ["Spanish", "French", "German", "Mandarin", "Japanese", "Italian"],
      gradeLevels: "All Levels",
      popularTopics: ["AP Spanish", "AP French", "Conversational", "Business Language"]
    },
    {
      name: "Computer Science",
      icon: CodeBracketIcon,
      color: "teal",
      description: "Programming, web development, and computer science fundamentals",
      topics: ["Python", "Java", "Web Development", "Data Structures", "Algorithms"],
      gradeLevels: "K-12 & College",
      popularTopics: ["AP Computer Science", "Web Development", "Machine Learning", "Cybersecurity"]
    },
    {
      name: "Test Preparation",
      icon: ChartBarIcon,
      color: "indigo",
      description: "Comprehensive test prep for all major standardized tests",
      topics: ["SAT", "ACT", "GRE", "GMAT", "LSAT", "MCAT", "AP Exams"],
      gradeLevels: "All Levels",
      popularTopics: ["SAT Prep", "ACT Prep", "AP Exams", "Graduate Tests"]
    }
  ];

  const counselingServices = [
    {
      name: "College Counseling",
      icon: AcademicCapIcon,
      color: "emerald",
      description: "Expert guidance for college selection, applications, and planning",
      services: ["College Selection", "Application Strategy", "Essay Review", "Financial Aid"],
      duration: "30-60 min sessions",
      popularServices: ["College Essays", "Application Strategy", "Financial Planning", "Career Guidance"]
    },
    {
      name: "Academic Counseling",
      icon: UserGroupIcon,
      color: "rose",
      description: "Personalized academic planning and study strategy development",
      services: ["Study Planning", "Academic Goals", "Learning Strategies", "Time Management"],
      duration: "30-60 min sessions",
      popularServices: ["Study Skills", "Academic Planning", "Goal Setting", "Motivation"]
    }
  ];

  return (
    <section
      id="subjects"
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Comprehensive Academic Support"
          subtitle="Expert tutoring and counseling services across all subjects and academic levels"
        />

        {/* Tutoring Services Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Academic Tutoring</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Personalized one-on-one tutoring with expert instructors across all subjects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutoringSubjects.map((subject, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                {/* Subject Header */}
                <div className="flex items-center mb-6">
                  <div className={`h-16 w-16 rounded-xl bg-gradient-to-r ${
                    subject.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    subject.color === 'green' ? 'from-green-500 to-green-600' :
                    subject.color === 'purple' ? 'from-purple-500 to-purple-600' :
                    subject.color === 'red' ? 'from-red-500 to-red-600' :
                    subject.color === 'yellow' ? 'from-yellow-500 to-yellow-600' :
                    subject.color === 'teal' ? 'from-teal-500 to-teal-600' :
                    subject.color === 'indigo' ? 'from-indigo-500 to-indigo-600' :
                    'from-gray-500 to-gray-600'
                  } flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    <subject.icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-1">
                      {subject.name}
                    </h4>
                    <p className="text-sm text-gray-500 font-medium">
                      {subject.gradeLevels}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {subject.description}
                </p>

                {/* Topics */}
                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Core Topics:</h5>
                  <div className="flex flex-wrap gap-2">
                    {subject.topics.map((topic, topicIndex) => (
                      <span
                        key={topicIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Popular Topics */}
                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Most Popular:</h5>
                  <div className="flex flex-wrap gap-2">
                    {subject.popularTopics.map((topic, topicIndex) => (
                      <span
                        key={topicIndex}
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          subject.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                          subject.color === 'green' ? 'bg-green-100 text-green-700' :
                          subject.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                          subject.color === 'red' ? 'bg-red-100 text-red-700' :
                          subject.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                          subject.color === 'teal' ? 'bg-teal-100 text-teal-700' :
                          subject.color === 'indigo' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Availability Badge */}
                <div className="flex items-center text-sm text-green-600 font-medium">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  <span>Available Now</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Counseling Services Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Counseling Services</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional guidance for academic planning and college preparation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {counselingServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                {/* Service Header */}
                <div className="flex items-center mb-6">
                  <div className={`h-16 w-16 rounded-xl bg-gradient-to-r ${
                    service.color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                    service.color === 'rose' ? 'from-rose-500 to-rose-600' :
                    'from-gray-500 to-gray-600'
                  } flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-1">
                      {service.name}
                    </h4>
                    <p className="text-sm text-gray-500 font-medium">
                      {service.duration}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Services */}
                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Services Include:</h5>
                  <div className="flex flex-wrap gap-2">
                    {service.services.map((serviceItem, serviceIndex) => (
                      <span
                        key={serviceIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                      >
                        {serviceItem}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Popular Services */}
                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Most Requested:</h5>
                  <div className="flex flex-wrap gap-2">
                    {service.popularServices.map((serviceItem, serviceIndex) => (
                      <span
                        key={serviceIndex}
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          service.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                          service.color === 'rose' ? 'bg-rose-100 text-rose-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {serviceItem}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Availability Badge */}
                <div className="flex items-center text-sm text-green-600 font-medium">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  <span>Available Now</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Level Information */}
        <div className="mt-20 bg-white rounded-2xl p-10 shadow-lg">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Support for Every Academic Level
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                K-5
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Elementary</h4>
              <p className="text-gray-600 leading-relaxed">
                Building fundamental skills with engaging, age-appropriate lessons and interactive learning methods
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Ages 5-11
                </span>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                6-8
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Middle School</h4>
              <p className="text-gray-600 leading-relaxed">
                Supporting transition to advanced concepts while developing strong study habits and critical thinking
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Ages 11-14
                </span>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                9-12
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">High School</h4>
              <p className="text-gray-600 leading-relaxed">
                Mastering complex subjects, preparing for college, and excelling on standardized tests
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Ages 14-18
                </span>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                +
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">College+</h4>
              <p className="text-gray-600 leading-relaxed">
                Advanced coursework support, graduate-level assistance, and professional development
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  18+ Years
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Academic Journey?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Connect with expert tutors and counselors today. Get personalized support tailored to your learning goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="/register"
                variant="secondary"
                icon={<ArrowRightIcon className="h-5 w-5" />}
                className="inline-flex items-center bg-white text-blue-600 hover:bg-gray-50"
              >
                Get Started Today
              </Button>
              <Button
                href="/#pricing"
                variant="outline"
                className="inline-flex items-center border-white text-white hover:bg-white hover:text-blue-600"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
