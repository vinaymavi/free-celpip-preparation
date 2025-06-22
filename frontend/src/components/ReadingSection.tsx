import { useState } from "react";
import {
  SparklesIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { generateReadingPassage } from "../utils/api";
import ModelSelector from "./ModelSelector";
import type { ModelConfig } from "../utils/langchain";

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
  const [topic, setTopic] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleModelChange = (config: ModelConfig) => {
    // Model configuration updated
    console.log("Model configured:", config);
    setError(null);
  };

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
          <ModelSelector onModelChange={handleModelChange} />
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

            {/* Topic Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic (Optional)
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., environmental science, technology, health..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
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
