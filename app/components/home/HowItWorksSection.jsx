import SectionTitle from "../shared/SectionTitle";

export default function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Create Your Profile",
      description: "Sign up and tell us about your learning needs and goals",
    },
    {
      step: "02",
      title: "Match With Tutors",
      description: "Browse and connect with expert tutors in your subject area",
    },
    {
      step: "03",
      title: "Schedule Sessions",
      description: "Book sessions and start learning at your convenience",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Getting Started Is Easy"
          subtitle="Our platform simplifies the tutoring process so you can focus on learning"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div
                className={`bg-gradient-to-r from-blue-500 to-blue-600 h-1 absolute top-8 left-[50%] w-full ${
                  i === 2 ? "hidden" : "hidden md:block"
                }`}
              ></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white text-xl font-bold mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-center">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
