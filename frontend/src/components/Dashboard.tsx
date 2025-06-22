import {
  ChartBarIcon,
  BookOpenIcon,
  PencilIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";

type Section = "dashboard" | "reading" | "writing" | "speaking" | "listening";

interface DashboardProps {
  onSectionSelect: (section: Section) => void;
}

export default function Dashboard({ onSectionSelect }: DashboardProps) {
  const sections = [
    {
      name: "Reading",
      description: "Practice reading comprehension with passages and questions",
      icon: BookOpenIcon,
      section: "reading" as Section,
      color: "bg-blue-500",
    },
    {
      name: "Writing",
      description: "Improve your writing skills with guided exercises",
      icon: PencilIcon,
      section: "writing" as Section,
      color: "bg-green-500",
    },
    {
      name: "Speaking",
      description: "Practice speaking tasks and get feedback",
      icon: MicrophoneIcon,
      section: "speaking" as Section,
      color: "bg-red-500",
    },
    {
      name: "Listening",
      description: "Listen to audio clips and answer comprehension questions",
      icon: SpeakerWaveIcon,
      section: "listening" as Section,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          CELPIP Preparation Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Welcome to your personalized CELPIP preparation platform. Choose a
          section below to start practicing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {sections.map((section) => (
          <div
            key={section.name}
            className="card hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSectionSelect(section.section)}
          >
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 w-12 h-12 ${section.color} rounded-lg flex items-center justify-center`}
              >
                <section.icon
                  className="w-6 h-6 text-white"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {section.name}
                </h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
            </div>
            <div className="mt-4">
              <button className="btn btn-primary w-full">
                Start Practicing
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-primary-600" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">
              Progress Tracking
            </h3>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Monitor your improvement across all sections with detailed analytics
            and performance insights.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center">
            <BookOpenIcon className="w-8 h-8 text-primary-600" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">
              AI-Generated Content
            </h3>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Practice with unlimited, AI-generated content tailored to CELPIP
            test patterns and requirements.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center">
            <SpeakerWaveIcon className="w-8 h-8 text-primary-600" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">
              Interactive Learning
            </h3>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Engage with interactive exercises and get immediate feedback to
            accelerate your learning.
          </p>
        </div>
      </div>
    </div>
  );
}
