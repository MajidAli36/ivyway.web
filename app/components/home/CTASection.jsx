import Button from "../shared/Button";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Transform Your Learning Journey?
        </h2>
        <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto">
          Join thousands of students who've already improved their grades and
          academic confidence with our platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/register" variant="white" size="large">
            Start Learning Today
          </Button>
          <Button
            href="/contact"
            variant="secondary"
            size="large"
            className="border-white text-white hover:bg-white/10"
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
}
