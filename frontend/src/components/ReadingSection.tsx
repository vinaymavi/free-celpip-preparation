import { useState } from "react";
import { SparklesIcon, ClockIcon } from "@heroicons/react/24/outline";
import { generateReadingPassage } from "../utils/api";
import Timer from "./Timer";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  // New properties for fill-in-the-blank style questions
  questionParts?: {
    before: string;
    after: string;
  };
}

// Add new interface for response section
interface ResponseSection {
  title: string;
  instruction: string;
  content: string;
  blanks: {
    id: number;
    options: string[];
    correctAnswer: number;
  }[];
}

interface ReadingPassage {
  title: string;
  content: string;
  questions: Question[];
  // Add response section to the passage
  responseSection?: ResponseSection;
  // Add diagram section
  diagram?: {
    title: string;
    items: Array<{
      id: number;
      label: string;
      icon: string;
      properties: Array<{
        name: string;
        value: string;
      }>;
    }>;
    emailHeader?: {
      to: string;
      from: string;
    };
  };
}

export default function ReadingSection() {
  const [activeSection, setActiveSection] = useState<string>("correspondence");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPassage, setCurrentPassage] = useState<ReadingPassage | null>(
    null
  );
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [selectedResponseAnswers, setSelectedResponseAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [showResults, setShowResults] = useState(false);
  const [topic, setTopic] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generatePassage = async () => {
    setIsGenerating(true);
    setError(null);
    setCurrentPassage(null); // Reset to show loading screen
    setSelectedAnswers({});
    setSelectedResponseAnswers({});
    setShowResults(false);

    try {
      // Pass the section type to the API
      const result = await generateReadingPassage(
        topic || undefined,
        activeSection
      );

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to generate passage");
      }

      setCurrentPassage(result.data);
    } catch (error) {
      console.error("Failed to generate passage:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate passage"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleResponseAnswerSelect = (blankId: number, answerIndex: number) => {
    setSelectedResponseAnswers((prev) => ({
      ...prev,
      [blankId]: answerIndex,
    }));
  };

  const submitAnswers = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!currentPassage) return { correct: 0, total: 0 };
    let correct = 0;
    let total = 0;

    // Score main questions
    currentPassage.questions.forEach((question) => {
      total++;
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });

    // Score response section if it exists (for correspondence and viewpoints sections)
    if (currentPassage.responseSection && (activeSection === "correspondence" || activeSection === "viewpoints")) {
      currentPassage.responseSection.blanks.forEach((blank) => {
        total++;
        if (selectedResponseAnswers[blank.id] === blank.correctAnswer) {
          correct++;
        }
      });
    }

    return { correct, total };
  };

  const getTopicsForSection = (section: string) => {
    switch (section) {
      case "correspondence":
        return [
          "Birthday Celebration Planning",
          "Family Wedding Invitation or Update",
          "Holiday Trip Details or Suggestions",
          "Dinner at a New Restaurant",
          "Moving to a New Apartment or City",
          "Attending a Friend's Graduation Ceremony",
          "Weekend Getaway or Camping Trip",
          "Hosting a Surprise Party",
          "Asking for Help with a School Project",
          "Thanking a Friend for Their Help",
          "Inviting Someone to a Cultural Event",
          "Apologizing for Missing a Meeting or Event",
          "Describing a Fun Day at the Beach or Park",
          "Discussing Pets and Pet Care",
          "Sharing Exciting News (e.g., New Job, Promotion)",
          "Arranging a Playdate for Children",
          "Giving Feedback about a Movie or Book",
          "Catching Up After a Long Time",
          "Explaining Why You Were Late",
          "Sending Congratulations on a New Baby",
          "Sharing Recipes or Cooking Experiences",
          "Talking About a Family Reunion",
          "Discussing Summer Plans or Winter Break",
          "Inviting Friends Over for a Barbecue",
          "Requesting to Borrow an Item (e.g., bike, tent)",
        ];
      case "diagram":
        return [
          "Transportation Options for Business Trip",
          "Conference Travel Planning",
          "University Campus Navigation",
          "Shopping Mall Directory and Store Locations",
          "Hotel Booking Comparison Chart",
          "Flight vs Train vs Bus Comparison",
          "Apartment Rental Options Comparison",
          "Restaurant Menu and Pricing Guide",
          "Library Floor Plan and Services",
          "Sports Facility Booking Options",
          "Event Venue Selection Guide",
          "Internet and Phone Plan Comparison",
          "Insurance Coverage Options",
          "Gym Membership Plans",
          "Course Registration Schedule",
        ];
      case "information":
        return [
          "Climate Change Effects",
          "Healthy Eating Guidelines",
          "Canadian Immigration Process",
          "Renewable Energy Sources",
          "Digital Privacy Protection",
          "Mental Health Awareness",
          "Educational Technology Trends",
          "Workplace Safety Procedures",
          "Cultural Diversity Benefits",
          "Financial Planning Basics",
          "Environmental Conservation",
          "Public Health Measures",
          "Career Development Strategies",
          "Transportation Innovations",
          "Community Volunteer Programs",
          "Canadian Healthcare System",
          "Sustainable Urban Development",
          "Internet Security and Cybersafety",
          "Canadian Economic Trends",
          "Biodiversity and Wildlife Protection",
        ];
      case "viewpoints":
        return [
          "Remote Work vs Office Work",
          "Public vs Private Transportation",
          "Traditional vs Online Education",
          "City Living vs Suburban Living",
          "Fast Food vs Home Cooking",
          "Social Media Benefits and Drawbacks",
          "Tourism Impact on Local Communities",
          "Technology in Child Education",
          "Mandatory Vaccination Policies",
          "Plastic Bag Bans Effectiveness",
          "Four-Day Work Week Debate",
          "Artificial Intelligence in Healthcare",
          "Minimum Wage Increase Effects",
          "Electric Cars vs Gas Cars",
          "Standardized Testing in Schools",
        ];
      default:
        return [];
    }
  };

  const renderDiagramSection = () => {
    if (!currentPassage?.diagram) return null;

    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {currentPassage.diagram.title}
        </h3>
        <div className="space-y-4">
          {currentPassage.diagram.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="text-4xl flex-shrink-0">{item.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">{item.label}</h4>
                <div className="space-y-1">
                  {item.properties.map((property, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      <span className="font-medium">{property.name}:</span>{" "}
                      {property.value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDiagramEmail = () => {
    if (!currentPassage || activeSection !== "diagram") return null;

    // Split the content by numbered placeholders like {1}, {2}, etc.
    const parts = currentPassage.content.split(/\{(\d+)\}/);
    const elements = [];

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Regular text parts
        if (parts[i]) {
          elements.push(
            <span key={`text-${i}`} className="text-gray-900">
              {parts[i]}
            </span>
          );
        }
      } else {
        // Blank placeholders
        const blankNumber = parseInt(parts[i]);
        const question = currentPassage.questions.find(
          (q) => q.id === blankNumber
        );

        if (question) {
          elements.push(
            <span key={`blank-${blankNumber}`} className="inline-flex mx-1">
              <select
                value={selectedAnswers[question.id] ?? ""}
                onChange={(e) =>
                  handleAnswerSelect(question.id, parseInt(e.target.value))
                }
                disabled={showResults}
                className={`inline-block min-w-[150px] px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  showResults
                    ? selectedAnswers[question.id] === question.correctAnswer
                      ? "bg-green-50 border-green-300 text-green-800"
                      : selectedAnswers[question.id] !== undefined
                      ? "bg-red-50 border-red-300 text-red-800"
                      : "bg-gray-50 border-gray-300"
                    : selectedAnswers[question.id] !== undefined
                    ? "bg-primary-50 border-primary-300"
                    : "bg-white border-gray-300"
                }`}
              >
                <option value="">↓</option>
                {question.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={optionIndex}>
                    {option}
                  </option>
                ))}
              </select>
              {showResults && (
                <div className="text-xs mt-1">
                  {selectedAnswers[question.id] === question.correctAnswer ? (
                    <span className="text-green-600 font-medium">✓</span>
                  ) : selectedAnswers[question.id] !== undefined ? (
                    <span className="text-red-600 font-medium">
                      ✗ ({question.options[question.correctAnswer]})
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      ({question.options[question.correctAnswer]})
                    </span>
                  )}
                </div>
              )}
            </span>
          );
        }
      }
    }

    return (
      <div className="card">
        <div className="mb-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium mb-2">
              📧 Read the following email message about the diagram on the left.
              Complete the email by filling in the blanks. Select the best
              choice for each blank from the drop-down menu (↓).
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                <strong>Subject:</strong> {currentPassage.title}
              </div>
              {currentPassage.diagram?.emailHeader?.to && (
                <div>
                  <strong>To:</strong> {currentPassage.diagram.emailHeader.to}
                </div>
              )}
              {currentPassage.diagram?.emailHeader?.from && (
                <div>
                  <strong>From:</strong>{" "}
                  {currentPassage.diagram.emailHeader.from}
                </div>
              )}
            </div>
          </div>
          <div className="p-4">
            <div className="leading-relaxed text-gray-900">{elements}</div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          {!showResults ? (
            <button
              onClick={submitAnswers}
              className="btn btn-primary"
              disabled={Object.keys(selectedAnswers).length === 0}
            >
              Submit Answers
            </button>
          ) : (
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900 mb-2">
                Score: {calculateScore().correct} / {calculateScore().total}
              </div>
              <button
                onClick={() => {
                  setCurrentPassage(null);
                  setShowResults(false);
                  setSelectedAnswers({});
                  setSelectedResponseAnswers({});
                  setError(null);
                }}
                className="btn btn-secondary"
              >
                Generate New Passage
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderViewpointsArticle = () => {
    if (!currentPassage || activeSection !== "viewpoints") return null;

    return (
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
          {currentPassage.title}
        </h2>
        <div className="prose max-w-none text-gray-700 leading-relaxed overflow-y-auto max-h-[calc(100vh-12rem)] pr-2">
          {currentPassage.content
            .split("\n")
            .map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
        </div>
        
        {/* Main Article Questions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Questions about the Article
          </h3>
          <div className="space-y-4">
            {currentPassage.questions.map((question, index) => (
              <div key={question.id} className="space-y-2">
                <div className="flex items-start space-x-3">
                  <span className="font-medium text-gray-900 mt-1">
                    {index + 1}.
                  </span>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      {question.question}
                    </h4>
                    <select
                      value={selectedAnswers[question.id] ?? ""}
                      onChange={(e) =>
                        handleAnswerSelect(question.id, parseInt(e.target.value))
                      }
                      disabled={showResults}
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        showResults
                          ? selectedAnswers[question.id] === question.correctAnswer
                            ? "bg-green-50 border-green-300 text-green-800"
                            : selectedAnswers[question.id] !== undefined
                            ? "bg-red-50 border-red-300 text-red-800"
                            : "bg-gray-50 border-gray-300"
                          : selectedAnswers[question.id] !== undefined
                          ? "bg-primary-50 border-primary-300"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <option value="">Choose an option</option>
                      {question.options.map((option, optionIndex) => (
                        <option key={optionIndex} value={optionIndex}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {showResults && (
                      <div className="mt-1 text-xs">
                        {selectedAnswers[question.id] === question.correctAnswer ? (
                          <span className="text-green-600 font-medium">✓ Correct</span>
                        ) : selectedAnswers[question.id] !== undefined ? (
                          <span className="text-red-600 font-medium">
                            ✗ Incorrect - Correct: {question.options[question.correctAnswer]}
                          </span>
                        ) : (
                          <span className="text-gray-600">
                            Not answered - Correct: {question.options[question.correctAnswer]}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderViewpointsComment = () => {
    if (!currentPassage || activeSection !== "viewpoints" || !currentPassage.responseSection) return null;

    // Split the content by numbered placeholders like {1}, {2}, etc.
    const parts = currentPassage.responseSection.content.split(/\{(\d+)\}/);
    const elements = [];

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Regular text parts
        if (parts[i]) {
          elements.push(
            <span key={`text-${i}`} className="text-gray-900">
              {parts[i]}
            </span>
          );
        }
      } else {
        // Blank placeholders
        const blankNumber = parseInt(parts[i]);
        const blank = currentPassage.responseSection.blanks.find(
          (b) => b.id === blankNumber
        );

        if (blank) {
          elements.push(
            <span key={`blank-${blankNumber}`} className="inline-flex mx-1">
              <select
                value={selectedResponseAnswers[blank.id] ?? ""}
                onChange={(e) =>
                  handleResponseAnswerSelect(blank.id, parseInt(e.target.value))
                }
                disabled={showResults}
                className={`inline-block min-w-[150px] px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  showResults
                    ? selectedResponseAnswers[blank.id] === blank.correctAnswer
                      ? "bg-green-50 border-green-300 text-green-800"
                      : selectedResponseAnswers[blank.id] !== undefined
                      ? "bg-red-50 border-red-300 text-red-800"
                      : "bg-gray-50 border-gray-300"
                    : selectedResponseAnswers[blank.id] !== undefined
                    ? "bg-primary-50 border-primary-300"
                    : "bg-white border-gray-300"
                }`}
              >
                <option value="">↓</option>
                {blank.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={optionIndex}>
                    {option}
                  </option>
                ))}
              </select>
              {showResults && (
                <div className="text-xs mt-1">
                  {selectedResponseAnswers[blank.id] === blank.correctAnswer ? (
                    <span className="text-green-600 font-medium">✓</span>
                  ) : selectedResponseAnswers[blank.id] !== undefined ? (
                    <span className="text-red-600 font-medium">
                      ✗ ({blank.options[blank.correctAnswer]})
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      ({blank.options[blank.correctAnswer]})
                    </span>
                  )}
                </div>
              )}
            </span>
          );
        }
      }
    }

    return (
      <div className="card">
        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-medium">i</span>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                {currentPassage.responseSection.instruction}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              {currentPassage.responseSection.title}
            </h3>
          </div>
          <div className="p-4">
            <div className="leading-relaxed text-gray-900">{elements}</div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          {!showResults ? (
            <button
              onClick={submitAnswers}
              className="btn btn-primary"
              disabled={
                Object.keys(selectedAnswers).length === 0 &&
                Object.keys(selectedResponseAnswers).length === 0
              }
            >
              Submit Answers
            </button>
          ) : (
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900 mb-2">
                Score: {calculateScore().correct} / {calculateScore().total}
                <span className="text-sm font-normal text-gray-600 ml-2">
                  (
                  {Math.round(
                    (calculateScore().correct / calculateScore().total) * 100
                  )}
                  %)
                </span>
              </div>
              <button
                onClick={generatePassage}
                className="btn btn-primary"
              >
                Try Another Passage
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFillInTheBlanks = (
    content: string,
    blanks: ResponseSection["blanks"]
  ) => {
    // Split the content by numbered placeholders like {1}, {2}, etc.
    const parts = content.split(/\{(\d+)\}/);
    const elements = [];

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Regular text parts
        if (parts[i]) {
          elements.push(
            <span key={`text-${i}`} className="text-gray-900">
              {parts[i]}
            </span>
          );
        }
      } else {
        // Blank placeholders
        const blankNumber = parseInt(parts[i]);
        const blank = blanks.find((b) => b.id === blankNumber);

        if (blank) {
          elements.push(
            <span key={`blank-${blankNumber}`} className="inline-flex mx-1">
              <select
                value={selectedResponseAnswers[blank.id] ?? ""}
                onChange={(e) =>
                  handleResponseAnswerSelect(blank.id, parseInt(e.target.value))
                }
                disabled={showResults}
                className={`inline-block min-w-[150px] px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  showResults
                    ? selectedResponseAnswers[blank.id] === blank.correctAnswer
                      ? "bg-green-50 border-green-300 text-green-800"
                      : selectedResponseAnswers[blank.id] !== undefined
                      ? "bg-red-50 border-red-300 text-red-800"
                      : "bg-gray-50 border-gray-300"
                    : selectedResponseAnswers[blank.id] !== undefined
                    ? "bg-primary-50 border-primary-300"
                    : "bg-white border-gray-300"
                }`}
              >
                <option value="">↓</option>
                {blank.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={optionIndex}>
                    {option}
                  </option>
                ))}
              </select>
              {showResults && (
                <div className="text-xs mt-1">
                  {selectedResponseAnswers[blank.id] === blank.correctAnswer ? (
                    <span className="text-green-600 font-medium">✓</span>
                  ) : selectedResponseAnswers[blank.id] !== undefined ? (
                    <span className="text-red-600 font-medium">
                      ✗ ({blank.options[blank.correctAnswer]})
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      ({blank.options[blank.correctAnswer]})
                    </span>
                  )}
                </div>
              )}
            </span>
          );
        }
      }
    }

    return <div className="leading-relaxed text-gray-900">{elements}</div>;
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reading Comprehension
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Practice reading passages with multiple-choice questions similar
              to the CELPIP test format.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Timer
              initialMinutes={11}
              initialSeconds={0}
              autoStart={false}
              size="md"
              showControls={true}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
            />
          </div>
        </div>

        {/* Section Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              {
                id: "correspondence",
                name: "Reading Correspondence",
                description: "Emails, letters, and messages",
              },
              {
                id: "diagram",
                name: "Reading to Apply a Diagram",
                description: "Charts, maps, and visual information",
              },
              {
                id: "information",
                name: "Reading for Information",
                description: "Factual passages and details",
              },
              {
                id: "viewpoints",
                name: "Reading for Viewpoints",
                description: "Opinions and different perspectives",
              },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setCurrentPassage(null);
                  setShowResults(false);
                  setSelectedAnswers({});
                  setSelectedResponseAnswers({});
                  setError(null);
                  setTopic(""); // Reset topic when switching sections
                }}
                className={`group relative min-w-0 flex-1 overflow-hidden py-4 px-6 text-center text-sm font-medium hover:bg-gray-50 focus:z-10 ${
                  activeSection === section.id
                    ? "border-primary-500 text-primary-600 border-b-2"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">{section.name}</span>
                  <span className="text-xs text-gray-400 mt-1">
                    {section.description}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {!currentPassage || isGenerating ? (
        <div className="text-center">
          <div className="card max-w-md mx-auto">
            <SparklesIcon className="mx-auto h-12 w-12 text-primary-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Generate{" "}
              {activeSection === "correspondence"
                ? "Reading Correspondence"
                : activeSection === "diagram"
                ? "Reading to Apply a Diagram"
                : activeSection === "information"
                ? "Reading for Information"
                : "Reading for Viewpoints"}{" "}
              Passage
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {activeSection === "correspondence"
                ? "Generate an email or message with comprehension questions and response section."
                : activeSection === "diagram"
                ? "Generate a passage describing visual information with interpretation questions."
                : activeSection === "information"
                ? "Generate an informative passage with factual comprehension questions."
                : "Generate a passage with different viewpoints and opinion-based questions."}
            </p>

            {/* Topic Selection */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic (Optional)
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a topic...</option>
                {getTopicsForSection(activeSection).map((topicOption) => (
                  <option key={topicOption} value={topicOption}>
                    {topicOption}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={generatePassage}
              disabled={isGenerating}
              className="btn btn-primary mt-4"
            >
              {isGenerating ? (
                <>
                  <ClockIcon className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Generate{" "}
                  {activeSection === "correspondence"
                    ? "Correspondence"
                    : activeSection === "diagram"
                    ? "Diagram"
                    : activeSection === "information"
                    ? "Information"
                    : "Viewpoints"}{" "}
                  Passage
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {activeSection === "diagram" ? (
            /* Diagram Section Layout */
            <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Left Side - Diagram */}
              <div className="lg:w-5/12">{renderDiagramSection()}</div>

              {/* Right Side - Email with blanks */}
              <div className="lg:w-7/12">{renderDiagramEmail()}</div>
            </div>
          ) : activeSection === "viewpoints" ? (
            /* Viewpoints Section Layout - Similar to Diagram */
            <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Left Side - Main Article */}
              <div className="lg:w-5/12">{renderViewpointsArticle()}</div>

              {/* Right Side - Reader Comment with blanks */}
              <div className="lg:w-7/12">{renderViewpointsComment()}</div>
            </div>
          ) : (
            /* Other Sections Layout */
            <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="card flex-1 flex flex-col max-h-screen">
                {/* Title for the passage */}
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {currentPassage.title}
                </h2>
                <div className="prose max-w-none text-gray-700 leading-relaxed overflow-y-auto max-h-[calc(100vh-12rem)] pr-2">
                  {currentPassage.content
                    .split("\n")
                    .map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>

              <div className="card flex-1 flex flex-col max-h-screen">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Questions
                </h3>
                {activeSection === "information" && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                      Decide which paragraph, A to D, has the information given in each statement below. Select E if the information is not given in any of the paragraphs.
                    </p>
                  </div>
                )}
                <div className="space-y-6 overflow-y-auto flex-1 pr-2 min-h-[300px]">
                  {currentPassage.questions.map((question, index) => (
                    <div key={question.id} className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <span className="font-medium text-gray-900 mt-1">
                          {index + 1}.
                        </span>
                        <div className="flex-1">
                          {question.questionParts ? (
                            <div className="text-gray-900 leading-relaxed">
                              <span>{question.questionParts.before} </span>
                              <div className="inline-block relative">
                                <select
                                  value={selectedAnswers[question.id] ?? ""}
                                  onChange={(e) =>
                                    handleAnswerSelect(
                                      question.id,
                                      parseInt(e.target.value)
                                    )
                                  }
                                  disabled={showResults}
                                  className={`inline-block min-w-[200px] px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                    showResults
                                      ? selectedAnswers[question.id] ===
                                        question.correctAnswer
                                        ? "bg-green-50 border-green-300 text-green-800"
                                        : selectedAnswers[question.id] !==
                                          undefined
                                        ? "bg-red-50 border-red-300 text-red-800"
                                        : "bg-gray-50 border-gray-300"
                                      : selectedAnswers[question.id] !==
                                        undefined
                                      ? "bg-primary-50 border-primary-300"
                                      : "bg-white border-gray-300"
                                  }`}
                                >
                                  <option value="">Choose an option ↓</option>
                                  {question.options.map(
                                    (option, optionIndex) => (
                                      <option
                                        key={optionIndex}
                                        value={optionIndex}
                                      >
                                        {option}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>
                              <span> {question.questionParts.after}</span>
                              {showResults && (
                                <div className="mt-2 text-sm">
                                  {selectedAnswers[question.id] ===
                                  question.correctAnswer ? (
                                    <span className="text-green-600 font-medium">
                                      ✓ Correct
                                    </span>
                                  ) : selectedAnswers[question.id] !==
                                    undefined ? (
                                    <span className="text-red-600 font-medium">
                                      ✗ Incorrect - Correct answer:{" "}
                                      {question.options[question.correctAnswer]}
                                    </span>
                                  ) : (
                                    <span className="text-gray-600">
                                      Not answered - Correct answer:{" "}
                                      {question.options[question.correctAnswer]}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            // Fallback for questions without questionParts (original format)
                            <div>
                              <h4 className="text-base font-medium text-gray-900 mb-3">
                                {question.question}
                              </h4>
                              <select
                                value={selectedAnswers[question.id] ?? ""}
                                onChange={(e) =>
                                  handleAnswerSelect(
                                    question.id,
                                    parseInt(e.target.value)
                                  )
                                }
                                disabled={showResults}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                  showResults
                                    ? selectedAnswers[question.id] === question.correctAnswer
                                      ? "bg-green-50 border-green-300 text-green-800"
                                      : selectedAnswers[question.id] !== undefined
                                      ? "bg-red-50 border-red-300 text-red-800"
                                      : "bg-gray-50 border-gray-300"
                                    : selectedAnswers[question.id] !== undefined
                                    ? "bg-primary-50 border-primary-300"
                                    : "bg-white border-gray-300"
                                }`}
                              >
                                <option value="">Choose an option</option>
                                {question.options.map((option, optionIndex) => (
                                  <option key={optionIndex} value={optionIndex}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              {showResults && (
                                <div className="mt-2 text-sm">
                                  {selectedAnswers[question.id] ===
                                  question.correctAnswer ? (
                                    <span className="text-green-600 font-medium">
                                      ✓ Correct
                                    </span>
                                  ) : selectedAnswers[question.id] !==
                                    undefined ? (
                                    <span className="text-red-600 font-medium">
                                      ✗ Incorrect - Correct answer:{" "}
                                      {question.options[question.correctAnswer]}
                                    </span>
                                  ) : (
                                    <span className="text-gray-600">
                                      Not answered - Correct answer:{" "}
                                      {question.options[question.correctAnswer]}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Response Section - Fill in the blanks (only for correspondence) */}
                  {currentPassage.responseSection &&
                    activeSection === "correspondence" && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-sm font-medium">
                                i
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">
                                {currentPassage.responseSection.instruction}
                              </h4>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {renderFillInTheBlanks(
                            currentPassage.responseSection.content,
                            currentPassage.responseSection.blanks
                          )}
                        </div>
                      </div>
                    )}
                </div>

                <div className="mt-8 flex justify-between">
                  {!showResults ? (
                    <button onClick={submitAnswers} className="btn btn-primary">
                      Submit Answers
                    </button>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <div className="text-lg font-semibold">
                        Score: {calculateScore().correct}/
                        {calculateScore().total}
                        <span className="text-sm font-normal text-gray-600 ml-2">
                          (
                          {Math.round(
                            (calculateScore().correct /
                              calculateScore().total) *
                              100
                          )}
                          %)
                        </span>
                      </div>
                      <button
                        onClick={generatePassage}
                        className="btn btn-primary"
                      >
                        Try Another Passage
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
