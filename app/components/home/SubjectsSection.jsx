import { CheckCircleIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Button from "../shared/Button";
import SectionTitle from "../shared/SectionTitle";

export default function SubjectsSection() {
  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English Literature",
    "History",
    "Economics",
    "Computer Science",
    "Foreign Languages",
    "SAT/ACT Prep",
    "AP Courses",
    "College Admissions",
  ];

  return (
    <section
      id="subjects"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <SectionTitle
        title="We Cover All Subjects"
        subtitle="From core academics to specialized topics, find expert help in any subject"
      />

      <div className="mt-10 text-center">
        <Button
          href="/subjects"
          variant="secondary"
          icon={<ArrowRightIcon className="h-5 w-5" />}
          className="inline-flex items-center"
        >
          View all subjects
        </Button>
      </div>
    </section>
  );
}
