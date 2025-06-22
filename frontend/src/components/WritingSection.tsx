import { useState } from "react";
import {
  SparklesIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { generateWritingPrompt } from "../utils/api";
import ModelSelector from "./ModelSelector";
import type { ModelConfig } from "../utils/langchain";

interface WritingPrompt {
  type: "email" | "essay";
  title: string;
  prompt: string;
  requirements: string[];
  timeLimit: number; // in minutes
}

export default function WritingSection() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<WritingPrompt | null>(
    null
  );
  const [userResponse, setUserResponse] = useState("");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const generatePrompt = async (type: "email" | "essay") => {
    setIsGenerating(true);

    // Simulate API call to generate writing prompt
    setTimeout(() => {
      const samplePrompts = {
        email: {
          type: "email" as const,
          title: "Responding to a Complaint",
          prompt: `You recently stayed at the Grand Hotel during your vacation. Unfortunately, your experience was not satisfactory due to several issues including noise from construction work, a broken air conditioning unit, and poor customer service at the front desk. You have decided to write a complaint email to the hotel management.

Write an email to the hotel manager expressing your dissatisfaction with your recent stay. In your email, you should:
- Explain the specific problems you encountered
- Describe how these issues affected your vacation
- Request appropriate compensation or resolution
- Maintain a professional but firm tone throughout`,
          requirements: [
            "Use appropriate email format (greeting, body, closing)",
            "Address all points mentioned in the prompt",
            "Maintain a professional tone",
            "Write 150-200 words",
            "Use proper grammar and vocabulary",
          ],
          timeLimit: 27,
        },
        essay: {
          type: "essay" as const,
          title: "Technology and Education",
          prompt: `Some people believe that technology has greatly improved education by making learning more accessible and interactive. Others argue that too much reliance on technology in education has negative effects on students\' social skills and critical thinking abilities.

Do you think technology has had a positive or negative impact on education? Give reasons and examples to support your opinion.

Write an essay responding to this question. In your essay, you should:
- State your position clearly
- Provide at least two main supporting arguments
- Include specific examples or evidence
- Address potential counterarguments
- Write a clear conclusion`,
          requirements: [
            "Write 200-300 words",
            "Include an introduction, body paragraphs, and conclusion",
            "State your position clearly",
            "Provide specific examples and evidence",
            "Use appropriate transitions and linking words",
          ],
          timeLimit: 51,
        },
      };

      setCurrentPrompt(samplePrompts[type]);
      setUserResponse("");
      setTimeLeft(samplePrompts[type].timeLimit * 60); // Convert to seconds
      setIsTimerActive(false);
      setIsGenerating(false);
    }, 1500);
  };

  const startTimer = () => {
    setIsTimerActive(true);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          setIsTimerActive(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const wordCount = userResponse
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const submitResponse = () => {
    alert(
      "Response submitted! In a real application, this would be sent for evaluation."
    );
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Writing Section</h1>
        <p className="mt-2 text-lg text-gray-600">
          Practice writing tasks including emails and essays similar to the
          CELPIP test format.
        </p>
      </div>

      {!currentPrompt ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-blue-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Email Writing
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Practice writing formal and informal emails responding to various
              situations.
            </p>
            <button
              onClick={() => generatePrompt("email")}
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
                  Generate Email Task
                </>
              )}
            </button>
          </div>

          <div className="card text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-green-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Essay Writing
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Practice argumentative and opinion essays on various topics.
            </p>
            <button
              onClick={() => generatePrompt("essay")}
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
                  Generate Essay Task
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentPrompt.title}
              </h2>
              <div className="flex items-center space-x-4">
                {timeLeft !== null && (
                  <div
                    className={`text-lg font-mono ${
                      timeLeft < 300 ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </div>
                )}
                {!isTimerActive && timeLeft !== null && timeLeft > 0 && (
                  <button
                    onClick={startTimer}
                    className="btn btn-outline btn-sm"
                  >
                    Start Timer
                  </button>
                )}
              </div>
            </div>

            <div className="prose max-w-none text-gray-700 mb-6">
              {currentPrompt.prompt.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-3">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {currentPrompt.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Time limit:</strong> {currentPrompt.timeLimit} minutes
              </p>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Response
              </h3>
              <div className="text-sm text-gray-600">Words: {wordCount}</div>
            </div>

            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder={`Start writing your ${currentPrompt.type} here...`}
              className="textarea h-96"
              disabled={timeLeft === 0}
            />

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setCurrentPrompt(null)}
                className="btn btn-outline"
              >
                Back to Tasks
              </button>
              <button
                onClick={submitResponse}
                disabled={wordCount < 50 || timeLeft === 0}
                className="btn btn-primary"
              >
                Submit Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
