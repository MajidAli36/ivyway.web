import SectionTitle from "../shared/SectionTitle";

export default function HowItWorksSection() {
  const tutoringSteps = [
    {
      step: "01",
      title: "Create Your Profile",
      description: "Sign up and tell us about your learning needs and academic goals",
    },
    {
      step: "02",
      title: "Match With Expert Tutors",
      description: "Browse and connect with qualified tutors in your subject area",
    },
    {
      step: "03",
      title: "Schedule Learning Sessions",
      description: "Book personalized tutoring sessions at your convenience",
    },
  ];

  const counselingSteps = [
    {
      step: "01",
      title: "Complete Assessment",
      description: "Share your academic background, interests, and college aspirations",
    },
    {
      step: "02",
      title: "Meet Your Counselor",
      description: "Connect with experienced college counselors who understand your goals",
    },
    {
      step: "03",
      title: "Get Personalized Guidance",
      description: "Receive tailored advice on college selection, applications, and planning",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="How It Works"
          subtitle="Choose the service that fits your needs and get started in minutes"
        />

        {/* Tutoring Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Academic Tutoring</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Get personalized help with your studies from expert tutors in various subjects
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tutoringSteps.map((step, i) => (
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
                  <h4 className="text-xl font-semibold text-slate-800 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-slate-600 text-center">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* College Counseling Section */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">College Counseling</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Navigate your college journey with expert guidance on applications, essays, and planning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {counselingSteps.map((step, i) => (
              <div key={i} className="relative">
                <div
                  className={`bg-gradient-to-r from-green-500 to-green-600 h-1 absolute top-8 left-[50%] w-full ${
                    i === 2 ? "hidden" : "hidden md:block"
                  }`}
                ></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center text-white text-xl font-bold mb-6">
                    {step.step}
                  </div>
                  <h4 className="text-xl font-semibold text-slate-800 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-slate-600 text-center">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
