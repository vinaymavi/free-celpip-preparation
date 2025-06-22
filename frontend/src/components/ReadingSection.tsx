import { useState } from "react";
import { SparklesIcon, ClockIcon } from "@heroicons/react/24/outline";
import { generateReadingPassage } from "../utils/api";

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
}

export default function ReadingSection() {
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

    try {
      const result = await generateReadingPassage(topic || undefined);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to generate passage");
      }

      setCurrentPassage(result.data);
      setSelectedAnswers({});
      setSelectedResponseAnswers({});
      setShowResults(false);
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

    // Score response section if it exists
    if (currentPassage.responseSection) {
      currentPassage.responseSection.blanks.forEach((blank) => {
        total++;
        if (selectedResponseAnswers[blank.id] === blank.correctAnswer) {
          correct++;
        }
      });
    }

    return { correct, total };
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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reading Comprehension
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Practice reading passages with multiple-choice questions similar
              to the CELPIP test format.
            </p>
          </div>
        </div>
      </div>

      {!currentPassage ? (
        <div className="text-center">
          <div className="card max-w-md mx-auto">
            <SparklesIcon className="mx-auto h-12 w-12 text-primary-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Generate Reading Passage
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Configure an AI model and generate a new reading passage with
              comprehension questions.
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
                <option value="Birthday Celebration Planning">
                  Birthday Celebration Planning
                </option>
                <option value="Family Wedding Invitation or Update">
                  Family Wedding Invitation or Update
                </option>
                <option value="Holiday Trip Details or Suggestions">
                  Holiday Trip Details or Suggestions
                </option>
                <option value="Dinner at a New Restaurant">
                  Dinner at a New Restaurant
                </option>
                <option value="Moving to a New Apartment or City">
                  Moving to a New Apartment or City
                </option>
                <option value="Attending a Friend's Graduation Ceremony">
                  Attending a Friend's Graduation Ceremony
                </option>
                <option value="Weekend Getaway or Camping Trip">
                  Weekend Getaway or Camping Trip
                </option>
                <option value="Hosting a Surprise Party">
                  Hosting a Surprise Party
                </option>
                <option value="Asking for Help with a School Project">
                  Asking for Help with a School Project
                </option>
                <option value="Thanking a Friend for Their Help">
                  Thanking a Friend for Their Help
                </option>
                <option value="Inviting Someone to a Cultural Event">
                  Inviting Someone to a Cultural Event
                </option>
                <option value="Apologizing for Missing a Meeting or Event">
                  Apologizing for Missing a Meeting or Event
                </option>
                <option value="Describing a Fun Day at the Beach or Park">
                  Describing a Fun Day at the Beach or Park
                </option>
                <option value="Discussing Pets and Pet Care">
                  Discussing Pets and Pet Care
                </option>
                <option value="Sharing Exciting News (e.g., New Job, Promotion)">
                  Sharing Exciting News (e.g., New Job, Promotion)
                </option>
                <option value="Arranging a Playdate for Children">
                  Arranging a Playdate for Children
                </option>
                <option value="Giving Feedback about a Movie or Book">
                  Giving Feedback about a Movie or Book
                </option>
                <option value="Catching Up After a Long Time">
                  Catching Up After a Long Time
                </option>
                <option value="Explaining Why You Were Late">
                  Explaining Why You Were Late
                </option>
                <option value="Sending Congratulations on a New Baby">
                  Sending Congratulations on a New Baby
                </option>
                <option value="Sharing Recipes or Cooking Experiences">
                  Sharing Recipes or Cooking Experiences
                </option>
                <option value="Talking About a Family Reunion">
                  Talking About a Family Reunion
                </option>
                <option value="Discussing Summer Plans or Winter Break">
                  Discussing Summer Plans or Winter Break
                </option>
                <option value="Inviting Friends Over for a Barbecue">
                  Inviting Friends Over for a Barbecue
                </option>
                <option value="Requesting to Borrow an Item (e.g., bike, tent)">
                  Requesting to Borrow an Item (e.g., bike, tent)
                </option>
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
                  Generate Passage
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="card flex-1 flex flex-col max-h-screen">
              <div className="prose max-w-none text-gray-700 leading-relaxed overflow-y-auto max-h-[calc(100vh-12rem)] pr-2">
                {currentPassage.content.split("\n").map((paragraph, index) => (
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
              <div className="space-y-6 overflow-y-auto flex-1 pr-2">
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
                                    : selectedAnswers[question.id] !== undefined
                                    ? "bg-primary-50 border-primary-300"
                                    : "bg-white border-gray-300"
                                }`}
                              >
                                <option value="">Choose an option ↓</option>
                                {question.options.map((option, optionIndex) => (
                                  <option key={optionIndex} value={optionIndex}>
                                    {option}
                                  </option>
                                ))}
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
              </div>

              {/* Response Section - Fill in the blanks */}
              {currentPassage.responseSection && (
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

              <div className="mt-8 flex justify-between">
                {!showResults ? (
                  <button onClick={submitAnswers} className="btn btn-primary">
                    Submit Answers
                  </button>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="text-lg font-semibold">
                      Score: {calculateScore().correct}/{calculateScore().total}
                      <span className="text-sm font-normal text-gray-600 ml-2">
                        (
                        {Math.round(
                          (calculateScore().correct / calculateScore().total) *
                            100
                        )}
                        %)
                      </span>
                    </div>
                    <button
                      onClick={generatePassage}
                      className="btn btn-outline"
                    >
                      Try Another Passage
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
