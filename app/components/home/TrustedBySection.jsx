export default function TrustedBySection() {
  const universities = [
    "Harvard University",
    "Stanford University",
    "MIT",
    "Oxford University",
    "Cambridge University",
    "Yale University",
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-slate-500 font-medium mb-8">
          TRUSTED BY TOP SCHOOLS AND UNIVERSITIES
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {universities.map((university, i) => (
            <div
              key={i}
              className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
            >
              <div className="h-12 bg-blue-50 rounded-md flex items-center justify-center px-6 border border-blue-100 hover:border-blue-200 transition-all">
                <div className="text-slate-700 font-bold text-xs md:text-sm">
                  {university}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
