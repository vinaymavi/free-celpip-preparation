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
  // New properties for fill-in-the-blank style questions
  questionParts?: {
    before: string;
    after: string;
  };
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
            question: "Sarah's plan for the weekend",
            questionParts: {
              before: "Sarah wants to",
              after: "this weekend."
            },
            options: [
              "stay home and read",
              "visit a new art museum",
              "go shopping downtown",
              "attend a music concert",
            ],
            correctAnswer: 1,
          },
          {
            id: 2,
            question: "The museum exhibition theme",
            questionParts: {
              before: "The museum has a special exhibition on",
              after: "."
            },
            options: [
              "ancient Roman artifacts",
              "European classical paintings",
              "modern Canadian artists",
              "contemporary sculptures",
            ],
            correctAnswer: 2,
          },
          {
            id: 3,
            question: "Meeting time arrangement",
            questionParts: {
              before: "Mike will pick up Sarah at",
              after: "."
            },
            options: ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
            correctAnswer: 1,
          },
          {
            id: 4,
            question: "Sarah's transportation preference",
            questionParts: {
              before: "Sarah prefers that Mike picks her up because",
              after: "."
            },
            options: [
              "she doesn't have a car",
              "she doesn't like driving",
              "parking downtown is expensive",
              "Mike offered to drive",
            ],
            correctAnswer: 2,
          },
          {
            id: 5,
            question: "Additional plan during the trip",
            questionParts: {
              before: "On the way to the museum, they plan to",
              after: "."
            },
            options: [
              "have breakfast",
              "get coffee",
              "buy tickets online",
              "stop at a bookstore",
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
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-medium">i</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Using the drop-down menu (↓), choose the best option according to the information given in the message.
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Listen to the audio clip carefully</li>
                    <li>• You can play the audio multiple times</li>
                    <li>• Complete each sentence by selecting the best option from the dropdown</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Questions
            </h3>
            <div className="space-y-6">
              {currentTask.questions.map((question, index) => (
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
                              value={selectedAnswers[question.id] ?? ''}
                              onChange={(e) =>
                                handleAnswerSelect(question.id, parseInt(e.target.value))
                              }
                              disabled={showResults}
                              className={`inline-block min-w-[200px] px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
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
                              {selectedAnswers[question.id] === question.correctAnswer ? (
                                <span className="text-green-600 font-medium">
                                  ✓ Correct
                                </span>
                              ) : selectedAnswers[question.id] !== undefined ? (
                                <span className="text-red-600 font-medium">
                                  ✗ Incorrect - Correct answer: {question.options[question.correctAnswer]}
                                </span>
                              ) : (
                                <span className="text-gray-600">
                                  Not answered - Correct answer: {question.options[question.correctAnswer]}
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
                            value={selectedAnswers[question.id] ?? ''}
                            onChange={(e) =>
                              handleAnswerSelect(question.id, parseInt(e.target.value))
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
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              {!showResults ? (
                <button
                  onClick={submitAnswers}
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
