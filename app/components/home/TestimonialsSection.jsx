import { StarIcon } from "@heroicons/react/24/outline";
import SectionTitle from "../shared/SectionTitle";
import { useState } from "react";

export default function TestimonialsSection() {
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const testimonials = [
    {
      name: "Emma Thompson",
      role: "High School Student",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      content:
        "The personalized approach made all the difference. My math scores improved dramatically within just a few months.",
    },
    {
      name: "James Wilson",
      role: "College Student",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      content:
        "Finding a tutor who could explain complex physics concepts in a way I understand was life-changing. Highly recommend!",
    },
    {
      name: "Sophia Martinez",
      role: "Parent",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      content:
        "As a parent, I appreciate the progress tracking and regular updates. My daughter's confidence has grown tremendously.",
    },
    {
      name: "Michael Chen",
      role: "Graduate Student",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      content:
        "The tutors here are incredibly knowledgeable and patient. They helped me understand complex calculus concepts that I struggled with for months.",
    },
    {
      name: "Sarah Johnson",
      role: "Parent",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
      content:
        "My son went from failing chemistry to getting an A+. The personalized approach and regular feedback made all the difference.",
    },
    {
      name: "David Rodriguez",
      role: "High School Student",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      content:
        "The flexibility to schedule sessions around my busy schedule is amazing. The tutors are always prepared and make learning fun.",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="What Our Students Say"
          subtitle="Real stories from students who've transformed their academic journey"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <div className="relative">
                  {!imageErrors[i] ? (
                    <img
                      src={testimonial.photo}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md"
                      onError={() => handleImageError(i)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium text-sm shadow-md">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
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
