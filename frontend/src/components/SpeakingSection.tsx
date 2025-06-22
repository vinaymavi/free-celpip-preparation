import { useState } from "react";
import {
  SparklesIcon,
  ClockIcon,
  MicrophoneIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

interface SpeakingTask {
  id: number;
  type: "personal_experience" | "describing_scene" | "prediction" | "opinion";
  title: string;
  prompt: string;
  preparationTime: number; // in seconds
  responseTime: number; // in seconds
}

export default function SpeakingSection() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTask, setCurrentTask] = useState<SpeakingTask | null>(null);
  const [phase, setPhase] = useState<"preparation" | "recording" | "completed">(
    "preparation"
  );
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const generateTask = async () => {
    setIsGenerating(true);

    // Simulate API call to generate speaking task
    setTimeout(() => {
      const sampleTasks = [
        {
          id: 1,
          type: "personal_experience" as const,
          title: "Talk about a memorable event",
          prompt: `Tell me about a time when you helped someone in your community. You should speak about:
          - What the situation was
          - How you decided to help
          - What you did to help
          - How you felt about the experience
          
          You have 30 seconds to prepare and 60 seconds to respond.`,
          preparationTime: 30,
          responseTime: 60,
        },
        {
          id: 2,
          type: "describing_scene" as const,
          title: "Describe what you see",
          prompt: `Look at this image and describe what you see. Talk about:
          - The setting and location
          - The people and their activities  
          - The objects and their arrangement
          - The mood or atmosphere of the scene
          
          You have 30 seconds to prepare and 60 seconds to respond.`,
          preparationTime: 30,
          responseTime: 60,
        },
        {
          id: 3,
          type: "prediction" as const,
          title: "Make a prediction",
          prompt: `In this picture, you see people at what appears to be the beginning of an event. What do you think will happen next? Consider:
          - What the people might do
          - How the situation might develop
          - What challenges they might face
          - What the outcome might be
          
          You have 30 seconds to prepare and 60 seconds to respond.`,
          preparationTime: 30,
          responseTime: 60,
        },
        {
          id: 4,
          type: "opinion" as const,
          title: "Express your opinion",
          prompt: `Some people believe that social media has made communication easier and brought people closer together. Others think it has made people more isolated and reduced face-to-face interaction.
          
          What is your opinion? Do you think social media improves or harms human relationships? Explain your position with reasons and examples.
          
          You have 30 seconds to prepare and 90 seconds to respond.`,
          preparationTime: 30,
          responseTime: 90,
        },
      ];

      const randomTask =
        sampleTasks[Math.floor(Math.random() * sampleTasks.length)];
      setCurrentTask(randomTask);
      setPhase("preparation");
      setTimeLeft(randomTask.preparationTime);
      setIsRecording(false);
      setIsGenerating(false);
    }, 1500);
  };

  const startPreparation = () => {
    if (!currentTask) return;

    setPhase("preparation");
    setTimeLeft(currentTask.preparationTime);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = () => {
    if (!currentTask) return;

    setPhase("recording");
    setTimeLeft(currentTask.responseTime);
    setIsRecording(true);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setPhase("completed");
          setIsRecording(false);
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

  const getTaskTypeColor = (type: string) => {
    const colors = {
      personal_experience: "bg-blue-500",
      describing_scene: "bg-green-500",
      prediction: "bg-purple-500",
      opinion: "bg-orange-500",
    };
    return colors[type as keyof typeof colors] || "bg-gray-500";
  };

  const getTaskTypeLabel = (type: string) => {
    const labels = {
      personal_experience: "Personal Experience",
      describing_scene: "Describing Scene",
      prediction: "Making Predictions",
      opinion: "Expressing Opinion",
    };
    return labels[type as keyof typeof labels] || "Speaking Task";
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Speaking Section</h1>
        <p className="mt-2 text-lg text-gray-600">
          Practice speaking tasks with preparation and response time limits
          similar to the CELPIP test.
        </p>
      </div>

      {!currentTask ? (
        <div className="text-center">
          <div className="card max-w-md mx-auto">
            <MicrophoneIcon className="mx-auto h-12 w-12 text-red-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Generate Speaking Task
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Click the button below to generate a random speaking task with
              different question types.
            </p>
            <button
              onClick={generateTask}
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
                  Generate Task
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${getTaskTypeColor(
                    currentTask.type
                  )} mr-3`}
                ></div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentTask.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {getTaskTypeLabel(currentTask.type)}
                  </p>
                </div>
              </div>
              {timeLeft !== null && timeLeft > 0 && (
                <div
                  className={`text-2xl font-mono font-bold ${
                    phase === "preparation"
                      ? "text-blue-600"
                      : phase === "recording"
                      ? timeLeft < 10
                        ? "text-red-600"
                        : "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {formatTime(timeLeft)}
                </div>
              )}
            </div>

            <div className="prose max-w-none text-gray-700 mb-6">
              {currentTask.prompt.split("\n").map((line, index) => (
                <p key={index} className="mb-2">
                  {line}
                </p>
              ))}
            </div>

            <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
              {phase === "preparation" &&
                timeLeft === currentTask.preparationTime && (
                  <div className="text-center">
                    <ClockIcon className="mx-auto h-16 w-16 text-blue-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Preparation Phase
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      You have {currentTask.preparationTime} seconds to prepare
                      your response.
                    </p>
                    <button
                      onClick={startPreparation}
                      className="btn btn-primary"
                    >
                      <PlayIcon className="w-4 h-4 mr-2" />
                      Start Preparation
                    </button>
                  </div>
                )}

              {phase === "preparation" &&
                timeLeft !== currentTask.preparationTime && (
                  <div className="text-center">
                    <ClockIcon className="mx-auto h-16 w-16 text-blue-600 mb-4 animate-pulse" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Preparing...
                    </h3>
                    <p className="text-sm text-gray-600">
                      Think about what you want to say. Recording will start
                      automatically.
                    </p>
                  </div>
                )}

              {phase === "recording" && (
                <div className="text-center">
                  <MicrophoneIcon
                    className={`mx-auto h-16 w-16 mb-4 ${
                      isRecording
                        ? "text-red-600 animate-pulse"
                        : "text-gray-400"
                    }`}
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isRecording ? "Recording..." : "Ready to Record"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Speak clearly and try to use all the available time.
                  </p>
                  <div className="mt-4 w-32 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-1000"
                      style={{
                        width: `${
                          100 - (timeLeft! / currentTask.responseTime) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {phase === "completed" && (
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-green-600 text-2xl">✓</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Task Completed!
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Great job! In a real test, your response would be recorded
                    and evaluated.
                  </p>
                  <button onClick={generateTask} className="btn btn-outline">
                    Try Another Task
                  </button>
                </div>
              )}
            </div>

            {phase === "preparation" && (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Tips for preparation:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Think about the main points you want to cover</li>
                  <li>• Consider specific examples or details</li>
                  <li>• Plan the structure of your response</li>
                  <li>• Remember to speak clearly and at a natural pace</li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setCurrentTask(null)}
              className="btn btn-outline"
            >
              Back to Task Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
