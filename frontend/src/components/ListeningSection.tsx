import { useState } from "react";
import {
  SparklesIcon,
  ClockIcon,
  SpeakerWaveIcon,
  PlayIcon,
  PauseIcon,
} from "@heroicons/react/24/outline";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ListeningTask {
  id: number;
  type: "conversation" | "news" | "information";
  title: string;
  audioUrl: string; // In a real app, this would be an actual audio file URL
  transcript: string;
  questions: Question[];
  duration: number; // in seconds
}

export default function ListeningSection() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTask, setCurrentTask] = useState<ListeningTask | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [showResults, setShowResults] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const generateTask = async () => {
    setIsGenerating(true);

    // Simulate API call to generate listening task
    setTimeout(() => {
      const sampleTask: ListeningTask = {
        id: 1,
        type: "conversation",
        title: "Conversation about Weekend Plans",
        audioUrl: "/sample-audio.mp3", // This would be a real audio file
        transcript: `Sarah: Hi Mike! Do you have any plans for this weekend?

Mike: Hi Sarah! Not really, I was thinking of just staying home and catching up on some reading. What about you?

Sarah: Well, I was hoping to visit the new art museum downtown. They have a special exhibition on modern Canadian artists that I've been wanting to see. Would you like to come with me?

Mike: That sounds interesting! I haven't been to an art museum in ages. What time were you thinking of going?

Sarah: The museum opens at 10 AM, so we could go around 11 to avoid the morning rush. The exhibition runs until 5 PM, so we'd have plenty of time.

Mike: Perfect! Should we meet there, or would you like me to pick you up?

Sarah: Actually, it would be great if you could pick me up. Parking downtown can be quite expensive, and I know you don't mind driving.

Mike: No problem at all! I'll pick you up at 10:30, and we can grab a coffee on the way if you'd like.

Sarah: That sounds wonderful! I'm really looking forward to it. I've heard the exhibition includes some amazing landscape paintings and sculptures.

Mike: Great! I'll see you on Saturday then. Thanks for inviting me - it'll be a nice change from my usual weekend routine.`,
        questions: [
          {
            id: 1,
            question: "What does Sarah want to do this weekend?",
            options: [
              "Stay home and read",
              "Visit a new art museum",
              "Go shopping downtown",
              "Attend a music concert",
            ],
            correctAnswer: 1,
          },
          {
            id: 2,
            question: "What type of exhibition is currently at the museum?",
            options: [
              "Ancient Roman artifacts",
              "European classical paintings",
              "Modern Canadian artists",
              "Contemporary sculptures",
            ],
            correctAnswer: 2,
          },
          {
            id: 3,
            question: "What time do they plan to meet?",
            options: ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
            correctAnswer: 1,
          },
          {
            id: 4,
            question: "Why does Sarah prefer that Mike picks her up?",
            options: [
              "She doesn't have a car",
              "She doesn't like driving",
              "Parking downtown is expensive",
              "Mike offered to drive",
            ],
            correctAnswer: 2,
          },
          {
            id: 5,
            question: "What do they plan to do on the way to the museum?",
            options: [
              "Have breakfast",
              "Get coffee",
              "Buy tickets online",
              "Stop at a bookstore",
            ],
            correctAnswer: 1,
          },
        ],
        duration: 180, // 3 minutes
      };

      setCurrentTask(sampleTask);
      setSelectedAnswers({});
      setShowResults(false);
      setShowTranscript(false);
      setIsPlaying(false);
      setCurrentTime(0);
      setIsGenerating(false);
    }, 1500);
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
    if (!currentTask) return 0;
    let correct = 0;
    currentTask.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  // Simulate audio playback
  const togglePlayback = () => {
    if (!currentTask) return;

    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Simulate audio progress
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentTask.duration) {
            setIsPlaying(false);
            clearInterval(interval);
            return currentTask.duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTaskTypeColor = (type: string) => {
    const colors = {
      conversation: "bg-blue-500",
      news: "bg-red-500",
      information: "bg-green-500",
    };
    return colors[type as keyof typeof colors] || "bg-gray-500";
  };

  const getTaskTypeLabel = (type: string) => {
    const labels = {
      conversation: "Conversation",
      news: "News Report",
      information: "Information Session",
    };
    return labels[type as keyof typeof labels] || "Listening Task";
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Listening Section</h1>
        <p className="mt-2 text-lg text-gray-600">
          Practice listening to audio clips and answering comprehension
          questions.
        </p>
      </div>

      {!currentTask ? (
        <div className="text-center">
          <div className="card max-w-md mx-auto">
            <SpeakerWaveIcon className="mx-auto h-12 w-12 text-purple-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Generate Listening Task
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Click the button below to generate a new listening comprehension
              task.
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
            <div className="flex items-center justify-between mb-6">
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
            </div>

            {/* Audio Player */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <button
                    onClick={togglePlayback}
                    className="flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                  >
                    {isPlaying ? (
                      <PauseIcon className="w-6 h-6" />
                    ) : (
                      <PlayIcon className="w-6 h-6 ml-1" />
                    )}
                  </button>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      Audio Clip
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatTime(currentTime)} /{" "}
                      {formatTime(currentTask.duration)}
                    </p>
                  </div>
                </div>
                <SpeakerWaveIcon className="w-8 h-8 text-gray-400" />
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(currentTime / currentTask.duration) * 100}%`,
                  }}
                ></div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Note: This is a simulated audio experience. In a real test,
                  you would hear actual audio.
                </p>
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  {showTranscript ? "Hide" : "Show"} Transcript (for demo
                  purposes)
                </button>
              </div>

              {showTranscript && (
                <div className="mt-4 p-4 bg-white rounded border">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Transcript:
                  </h4>
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {currentTask.transcript}
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Listen to the audio clip carefully</li>
                <li>• You can play the audio multiple times</li>
                <li>• Answer all questions based on what you heard</li>
                <li>• Choose the best answer for each question</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Questions
            </h3>
            <div className="space-y-6">
              {currentTask.questions.map((question, index) => (
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
                    currentTask.questions.length
                  }
                  className="btn btn-primary"
                >
                  Submit Answers
                </button>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="text-lg font-semibold">
                    Score: {calculateScore()}/{currentTask.questions.length}
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      (
                      {Math.round(
                        (calculateScore() / currentTask.questions.length) * 100
                      )}
                      %)
                    </span>
                  </div>
                  <button onClick={generateTask} className="btn btn-outline">
                    Try Another Task
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
