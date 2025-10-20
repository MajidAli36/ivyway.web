import { useState } from "react";
import { ENHANCED_SUBJECTS } from "../../../../constants/enhancedSubjects";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export default function SubjectPicker({ selectedSubject, onSelectSubject }) {
  const [selectedMainSubject, setSelectedMainSubject] = useState("");
  const [selectedGradeLevel, setSelectedGradeLevel] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [expandedSubject, setExpandedSubject] = useState(null);

  const handleMainSubjectSelect = (subjectKey) => {
    setSelectedMainSubject(subjectKey);
    setSelectedGradeLevel("");
    setSelectedTopic("");
    setExpandedSubject(expandedSubject === subjectKey ? null : subjectKey);
  };

  const handleGradeLevelSelect = (gradeLevel) => {
    setSelectedGradeLevel(gradeLevel);
    setSelectedTopic("");
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    // Call the parent callback with the complete selection
    onSelectSubject &&
      onSelectSubject({
        mainSubject: ENHANCED_SUBJECTS[selectedMainSubject].name,
        gradeLevel: selectedGradeLevel,
        topic: topic,
        fullSubject: `${ENHANCED_SUBJECTS[selectedMainSubject].name} - ${selectedGradeLevel} - ${topic}`,
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Your Subject
        </h2>
        <p className="text-gray-600">
          Choose the subject area and specific topic you need help with
        </p>
      </div>

      {/* Main Subject Categories */}
      <div className="space-y-4">
        {Object.entries(ENHANCED_SUBJECTS).map(([subjectKey, subject]) => (
          <div
            key={subjectKey}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Main Subject Header */}
            <button
              onClick={() => handleMainSubjectSelect(subjectKey)}
              className={`w-full p-4 text-left flex items-center justify-between transition-colors cursor-pointer ${
                selectedMainSubject === subjectKey
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 mr-3 text-blue-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d={subject.icon} />
                </svg>
                <span className="text-lg font-medium text-gray-900">
                  {subject.name}
                </span>
              </div>
              {expandedSubject === subjectKey ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {/* Grade Levels (Expanded Content) */}
            {expandedSubject === subjectKey && (
              <div className="p-4 bg-white border-t border-gray-200">
                {/* Grade Levels as selectable cards */}
                <div className="grid gap-4 md:grid-cols-2">
                  {subject.gradelevels.map((gradeLevel, index) => (
                    <button
                      key={index}
                      onClick={() => handleGradeLevelSelect(gradeLevel.name)}
                      className={`border border-gray-200 rounded-lg overflow-hidden text-left p-4 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                        selectedGradeLevel === gradeLevel.name
                          ? "bg-blue-100 text-blue-900 border-blue-300"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <span className="font-medium">{gradeLevel.name}</span>
                    </button>
                  ))}
                </div>

                {/* Topics panel spans full width to avoid empty second column */}
                {selectedGradeLevel && (
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="mb-3 font-medium text-gray-800">
                      Choose a topic
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                      {subject.gradelevels
                        .find((g) => g.name === selectedGradeLevel)
                        ?.topics.map((topic, topicIndex) => (
                          <button
                            key={topicIndex}
                            onClick={() => handleTopicSelect(topic)}
                            className={`px-3 py-2 text-sm rounded-md border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                              selectedTopic === topic
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                            }`}
                          >
                            {topic}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selection Summary */}
      {selectedMainSubject && selectedGradeLevel && selectedTopic && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">Selected Subject:</h3>
          <p className="text-green-700">
            <span className="font-medium">
              {ENHANCED_SUBJECTS[selectedMainSubject].name}
            </span>{" "}
            →<span className="font-medium"> {selectedGradeLevel}</span> →
            <span className="font-medium"> {selectedTopic}</span>
          </p>
        </div>
      )}
    </div>
  );
}
