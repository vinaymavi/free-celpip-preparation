import { useState } from "react";
import {
  SparklesIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Timer from "./Timer";

interface WritingPrompt {
  type: "email" | "essay";
  title: string;
  prompt: string;
  requirements: string[];
  timeLimit: number; // in minutes
}

const writingTabs = [
  {
    key: "email",
    label: "Email Writing",
    description:
      "Practice writing formal and informal emails responding to various situations.",
    icon: <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />,
  },
  {
    key: "essay",
    label: "Essay Writing",
    description: "Practice argumentative and opinion essays on various topics.",
    icon: <DocumentTextIcon className="h-5 w-5 mr-2 text-green-600" />,
  },
];

export default function WritingSection() {
  const [activeTab, setActiveTab] = useState<"email" | "essay">("email");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<WritingPrompt | null>(
    null
  );
  const [userResponse, setUserResponse] = useState("");
  const [timerKey, setTimerKey] = useState(0); // Key to reset timer when switching tasks

  const samplePrompts = {
    email: {
      type: "email" as const,
      title: "Responding to a Complaint",
      prompt: `You recently stayed at the Grand Hotel during your vacation. Unfortunately, your experience was not satisfactory due to several issues including noise from construction work, a broken air conditioning unit, and poor customer service at the front desk. You have decided to write a complaint email to the hotel management.\n\nWrite an email to the hotel manager expressing your dissatisfaction with your recent stay. In your email, you should:\n- Explain the specific problems you encountered\n- Describe how these issues affected your vacation\n- Request appropriate compensation or resolution\n- Maintain a professional but firm tone throughout`,
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
      prompt: `Some people believe that technology has greatly improved education by making learning more accessible and interactive. Others argue that too much reliance on technology in education has negative effects on students' social skills and critical thinking abilities.\n\nDo you think technology has had a positive or negative impact on education? Give reasons and examples to support your opinion.\n\nWrite an essay responding to this question. In your essay, you should:\n- State your position clearly\n- Provide at least two main supporting arguments\n- Include specific examples or evidence\n- Address potential counterarguments\n- Write a clear conclusion`,
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

  const generatePrompt = async (type: "email" | "essay") => {
    setIsGenerating(true);
    setTimeout(() => {
      setCurrentPrompt(samplePrompts[type]);
      setUserResponse("");
      setTimerKey((prev) => prev + 1);
      setIsGenerating(false);
    }, 1000);
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
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Writing Section
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Practice writing tasks including emails and essays similar to the
              CELPIP test format.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Timer
              key={timerKey}
              initialMinutes={
                currentPrompt?.timeLimit || samplePrompts[activeTab].timeLimit
              }
              initialSeconds={0}
              autoStart={false}
              size="md"
              showControls={true}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
            />
          </div>
        </div>
        {/* Tabs Navigation - full width, outside card, like ReadingSection */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex w-full">
            {writingTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as "email" | "essay");
                  setCurrentPrompt(null);
                  setUserResponse("");
                }}
                className={`group relative min-w-0 flex-1 overflow-hidden py-4 px-6 text-center text-sm font-medium hover:bg-gray-50 focus:z-10 transition-colors duration-200 focus:outline-none flex items-center justify-center ${
                  activeTab === tab.key
                    ? "border-primary-500 text-primary-600 border-b-2 bg-white"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                style={activeTab === tab.key ? { fontWeight: 600 } : {}}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Prompt & Requirements */}
        <div>
          {!currentPrompt ? (
            <div className="card text-center flex flex-col items-center justify-center h-full min-h-[350px]">
              <div className="mb-4">
                {writingTabs.find((t) => t.key === activeTab)?.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {writingTabs.find((t) => t.key === activeTab)?.label}
              </h3>
              <p className="text-gray-600 mb-6">
                {writingTabs.find((t) => t.key === activeTab)?.description}
              </p>
              <button
                onClick={() => generatePrompt(activeTab)}
                disabled={isGenerating}
                className="btn btn-primary mt-2"
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
                    {writingTabs.find((t) => t.key === activeTab)?.label} Task
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="card">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentPrompt.title}
                </h2>
              </div>
              <div className="prose max-w-none text-gray-700 mb-6">
                {currentPrompt.prompt.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Requirements:
                </h4>
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
          )}
        </div>
        {/* Right: Response */}
        <div>
          {currentPrompt ? (
            <div className="card h-full flex flex-col">
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
                className="textarea h-72 mb-4"
              />
              <div className="flex items-center justify-end mb-4">
                <button
                  onClick={submitResponse}
                  disabled={wordCount < 50}
                  className="btn btn-primary ml-4"
                >
                  Submit Response
                </button>
              </div>
              <button
                onClick={() => setCurrentPrompt(null)}
                className="btn btn-outline w-full"
              >
                Back to Tasks
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
