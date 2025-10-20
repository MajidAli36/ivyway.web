import {
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
  ChartBarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import SectionTitle from "../shared/SectionTitle";

export default function FeaturesSection() {
  const features = [
    {
      icon: UserGroupIcon,
      title: "Expert Tutors",
      description:
        "Verified professionals with extensive subject knowledge and teaching experience",
    },
    {
      icon: UserIcon,
      title: "College Counseling",
      description:
        "Get guidance from real college students who have successfully navigated the admissions process",
    },
    {
      icon: AcademicCapIcon,
      title: "Personalized Learning",
      description:
        "Custom learning plans tailored to your specific goals and learning style",
    },
    {
      icon: CalendarIcon,
      title: "Flexible Scheduling",
      description:
        "Book sessions at times that work for you, with instant confirmation",
    },
    {
      icon: ChartBarIcon,
      title: "Progress Tracking",
      description:
        "Monitor improvements with detailed analytics and regular assessments",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <SectionTitle
        title="Why Choose Our Tutoring Platform"
        subtitle="We combine technology with human expertise to deliver the best possible learning experience"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        {features.map((feature, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:transform hover:scale-[1.02] transition-all border border-blue-50"
          >
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
