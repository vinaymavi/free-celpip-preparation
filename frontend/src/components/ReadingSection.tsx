import { useState } from "react";
import { SparklesIcon, ClockIcon } from "@heroicons/react/24/outline";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ReadingPassage {
  title: string;
  content: string;
  questions: Question[];
}

export default function ReadingSection() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPassage, setCurrentPassage] = useState<ReadingPassage | null>(
    null
  );
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [showResults, setShowResults] = useState(false);

  const generatePassage = async () => {
    setIsGenerating(true);

    // Simulate API call to generate content
    setTimeout(() => {
      const samplePassage: ReadingPassage = {
        title: "The Benefits of Urban Gardening",
        content: `Urban gardening has become increasingly popular in recent years as more people recognize its numerous benefits for both individuals and communities. This practice involves growing plants, vegetables, and herbs in urban environments, utilizing spaces such as rooftops, balconies, community gardens, and even indoor areas.

One of the primary advantages of urban gardening is its positive impact on food security. By growing their own produce, urban residents can access fresh, nutritious foods while reducing their dependence on commercially grown vegetables that may have traveled long distances. This local production also helps reduce the carbon footprint associated with food transportation.

Furthermore, urban gardening contributes significantly to environmental sustainability. Plants in urban areas help improve air quality by absorbing carbon dioxide and releasing oxygen. They also help regulate temperature, reducing the urban heat island effect that makes cities warmer than surrounding areas. Additionally, urban gardens can help manage stormwater runoff, reducing the burden on city drainage systems.

The social benefits of urban gardening are equally important. Community gardens bring neighbors together, fostering social connections and strengthening community bonds. These spaces often serve as educational environments where people can learn about sustainable agriculture and environmental stewardship. For many urban dwellers, gardening provides a therapeutic outlet that reduces stress and promotes mental well-being.

Economic benefits also make urban gardening attractive. Growing your own food can significantly reduce grocery bills, especially for families with limited budgets. Some urban gardeners even turn their hobby into small businesses, selling excess produce at local farmers' markets or to restaurants.`,
        questions: [
          {
            id: 1,
            question:
              "According to the passage, which of the following is NOT mentioned as a location for urban gardening?",
            options: ["Rooftops", "Public parks", "Balconies", "Indoor areas"],
            correctAnswer: 1,
          },
          {
            id: 2,
            question:
              "The passage suggests that urban gardening helps with food security by:",
            options: [
              "Increasing commercial food production",
              "Reducing dependence on distant food sources",
              "Eliminating the need for grocery stores",
              "Providing jobs in the agricultural sector",
            ],
            correctAnswer: 1,
          },
          {
            id: 3,
            question:
              "What environmental benefit is mentioned regarding temperature regulation?",
            options: [
              "Urban gardens create cooler microclimates",
              "Plants reduce the urban heat island effect",
              "Gardening eliminates air pollution",
              "Urban farms prevent climate change",
            ],
            correctAnswer: 1,
          },
          {
            id: 4,
            question:
              "The social benefits of urban gardening include all of the following EXCEPT:",
            options: [
              "Bringing neighbors together",
              "Providing educational opportunities",
              "Reducing crime rates",
              "Promoting mental well-being",
            ],
            correctAnswer: 2,
          },
          {
            id: 5,
            question:
              "According to the passage, the economic benefits of urban gardening include:",
            options: [
              "Increasing property values",
              "Creating government revenue",
              "Reducing grocery expenses",
              "Attracting tourism",
            ],
            correctAnswer: 2,
          },
        ],
      };

      setCurrentPassage(samplePassage);
      setSelectedAnswers({});
      setShowResults(false);
      setIsGenerating(false);
    }, 2000);
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const submitAnswers = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!currentPassage) return 0;
    let correct = 0;
    currentPassage.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Reading Comprehension
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Practice reading passages with multiple-choice questions similar to
          the CELPIP test format.
        </p>
      </div>

      {!currentPassage ? (
        <div className="text-center">
          <div className="card max-w-md mx-auto">
            <SparklesIcon className="mx-auto h-12 w-12 text-primary-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Generate Reading Passage
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Click the button below to generate a new reading passage with
              comprehension questions.
            </p>
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
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentPassage.title}
            </h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {currentPassage.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Questions
            </h3>
            <div className="space-y-6">
              {currentPassage.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="border-l-4 border-primary-200 pl-4"
                >
                  <h4 className="text-base font-medium text-gray-900 mb-3">
                    {index + 1}. {question.question}
                  </h4>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedAnswers[question.id] === optionIndex
                            ? "bg-primary-50 border-primary-200 border"
                            : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                        } ${
                          showResults
                            ? optionIndex === question.correctAnswer
                              ? "bg-green-50 border-green-200"
                              : selectedAnswers[question.id] === optionIndex &&
                                optionIndex !== question.correctAnswer
                              ? "bg-red-50 border-red-200"
                              : ""
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={optionIndex}
                          checked={selectedAnswers[question.id] === optionIndex}
                          onChange={() =>
                            handleAnswerSelect(question.id, optionIndex)
                          }
                          disabled={showResults}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-3 text-gray-700">{option}</span>
                        {showResults &&
                          optionIndex === question.correctAnswer && (
                            <span className="ml-auto text-green-600 text-sm font-medium">
                              ✓ Correct
                            </span>
                          )}
                        {showResults &&
                          selectedAnswers[question.id] === optionIndex &&
                          optionIndex !== question.correctAnswer && (
                            <span className="ml-auto text-red-600 text-sm font-medium">
                              ✗ Incorrect
                            </span>
                          )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              {!showResults ? (
                <button
                  onClick={submitAnswers}
                  disabled={
                    Object.keys(selectedAnswers).length !==
                    currentPassage.questions.length
                  }
                  className="btn btn-primary"
                >
                  Submit Answers
                </button>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="text-lg font-semibold">
                    Score: {calculateScore()}/{currentPassage.questions.length}
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      (
                      {Math.round(
                        (calculateScore() / currentPassage.questions.length) *
                          100
                      )}
                      %)
                    </span>
                  </div>
                  <button onClick={generatePassage} className="btn btn-outline">
                    Try Another Passage
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
