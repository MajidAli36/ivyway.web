import { StarIcon } from "@heroicons/react/24/outline";
import SectionTitle from "../shared/SectionTitle";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Emma Thompson",
      role: "High School Student",
      content:
        "The personalized approach made all the difference. My math scores improved dramatically within just a few months.",
    },
    {
      name: "James Wilson",
      role: "College Student",
      content:
        "Finding a tutor who could explain complex physics concepts in a way I understand was life-changing. Highly recommend!",
    },
    {
      name: "Sophia Martinez",
      role: "Parent",
      content:
        "As a parent, I appreciate the progress tracking and regular updates. My daughter's confidence has grown tremendously.",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="What Our Students Say"
          subtitle="Real stories from students who've transformed their academic journey"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-blue-50"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-slate-600 mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="ml-3">
                  <div className="text-slate-800 font-medium">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
