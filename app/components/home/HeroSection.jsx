import Image from "next/image";
import { ArrowRightIcon, StarIcon } from "@heroicons/react/24/outline";
import Button from "../shared/Button";

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div>
            <span className="px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full">
              Trusted by 500+ students
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-slate-800 leading-tight">
              Unlock Your Academic Potential With{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                Expert Tutors & Counselors
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-600">
              Transform your academic journey with personalized 1-on-1 tutoring
              from certified experts and college counseling from real college
              students. Master any subject, build confidence, and unlock your
              full potential with our proven learning methodology.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button href="/register" variant="primary" size="large">
              Get Started
            </Button>
            <Button
              href="/how-it-works"
              variant="outline"
              size="large"
              icon={<ArrowRightIcon className="h-5 w-5" />}
              className="flex items-center justify-center"
            >
              How it works
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white text-sm font-medium border-2 border-white shadow-sm"
                >
                  {["JD", "EM", "AK", "RT"][i - 1]}
                </div>
              ))}
            </div>
            <div className="text-slate-600">
              <span className="font-semibold">500+</span> students already
              enrolled
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-gradient-to-r from-blue-100 to-blue-50 opacity-70 blur-3xl"></div>
          <div className="rounded-2xl bg-white shadow-xl overflow-hidden border border-blue-100 ">
            <Image
              src="/tutoring-hero.jpeg"
              alt="Student working with tutor"
              width={700}
              height={900}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border border-blue-100 transform transition-all hover:scale-105 hover:shadow-2xl duration-300">
            <div className="flex items-start space-x-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white shadow-lg">
                <StarIcon className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="font-bold text-lg text-slate-800">4.9/5</div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-slate-600 mb-3">
                  From 2,000+ reviews
                </div>
                <Button
                  href="/testimonials"
                  variant="outline"
                  size="small"
                  className="text-xs px-3 py-1.5 h-auto font-medium border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                >
                  View More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
