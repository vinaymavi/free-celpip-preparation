import { useState } from "react";
import {
  ClockIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Timer from "./Timer";

interface SurveyQuestion {
  id: number;
  title: string;
  situation: string;
  optionA: string;
  optionB: string;
  instructions: string;
}

interface EmailTask {
  id: number;
  title: string;
  situation: string;
  taskDescription: string;
  requirements: string[];
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
    label: "Responding to Survey Questions",
    description:
      "Practice responding to survey questions with opinion and argument.",
    icon: <DocumentTextIcon className="h-5 w-5 mr-2 text-green-600" />,
  },
];

const surveyQuestions: SurveyQuestion[] = [
  {
    id: 1,
    title: "Health Plan Survey",
    situation:
      "You work in a small company. The company is considering a new health plan. However, it can only use this health plan if everyone on the staff participates. The company has sent out an opinion survey to see what the staff members think about the plan.",
    optionA:
      "Old Plan: You use 1% of your salary to pay for a health plan. The health plan will cover some dental costs and 50% of your prescription medicine costs (i.e., the cost of medicines that a doctor orders for you).",
    optionB:
      "New Plan: You use 3% of your salary to pay for a health plan. The health plan will cover all dental costs, all prescription medication, and many other extra services such as glasses, physiotherapy (i.e., treatment for sports injuries), and so on.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 2,
    title: "Transportation Survey",
    situation:
      "Your city is planning to improve transportation. The city council has two main proposals and wants to hear from residents about which option they prefer.",
    optionA:
      "Expand Bus Service: Increase the number of buses and routes throughout the city. This would reduce wait times and provide better coverage to suburban areas.",
    optionB:
      "Build Light Rail System: Construct a modern light rail system connecting major districts. This would be faster but more expensive and take longer to complete.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 3,
    title: "Education Funding Survey",
    situation:
      "Your local school board has received additional funding and must decide how to spend it. They are asking parents and community members for their input on two proposals.",
    optionA:
      "Technology Upgrade: Purchase new computers, tablets, and interactive whiteboards for all classrooms to enhance digital learning capabilities.",
    optionB:
      "Reduce Class Sizes: Hire more teachers to reduce the number of students per classroom from 25 to 18, allowing for more personalized attention.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 4,
    title: "Workplace Policy Survey",
    situation:
      "Your company is considering new workplace policies to improve employee satisfaction. HR has presented two options and wants employee feedback.",
    optionA:
      "Flexible Hours: Employees can choose their start and end times within a 6 AM to 10 PM window, as long as they work 8 hours per day.",
    optionB:
      "Work From Home: Employees can work from home up to 3 days per week, with required office days on Tuesdays and Thursdays.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 5,
    title: "Community Center Survey",
    situation:
      "Your neighborhood is building a new community center and needs to decide on the main focus of the facility. The community association is asking residents for their preferences.",
    optionA:
      "Fitness Focus: A large gym with modern equipment, group fitness classes, swimming pool, and sports courts for basketball and tennis.",
    optionB:
      "Arts and Culture Focus: Art studios, music rooms, a small theater for performances, library space, and meeting rooms for community groups.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 6,
    title: "Housing Development Survey",
    situation:
      "Your city is planning a new residential development in your area. The planning committee is considering two different approaches and wants community input.",
    optionA:
      "High-Density Housing: Build apartment buildings and condominiums to house more people in a smaller area, with shared green spaces and amenities.",
    optionB:
      "Low-Density Housing: Build single-family homes with individual yards, creating a more suburban feel with less population density.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 7,
    title: "Environmental Initiative Survey",
    situation:
      "Your city wants to implement an environmental initiative and has narrowed it down to two options. The environmental committee is seeking public opinion.",
    optionA:
      "Recycling Program Expansion: Implement comprehensive recycling and composting programs with weekly pickup and education campaigns.",
    optionB:
      "Green Energy Transition: Install solar panels on public buildings and offer subsidies for residents to install renewable energy systems.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 8,
    title: "Library Services Survey",
    situation:
      "Your local library is updating its services and has budget for one major improvement. The library board wants to know which option the community prefers.",
    optionA:
      "Digital Expansion: Upgrade computer labs, provide more e-books and online databases, and offer digital literacy classes for all ages.",
    optionB:
      "Community Programming: Expand children's programs, book clubs, author visits, cultural events, and study spaces for students.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 9,
    title: "Park Development Survey",
    situation:
      "Your city has acquired land for a new park and is deciding between two development plans. The parks and recreation department wants community feedback.",
    optionA:
      "Active Recreation Park: Include sports fields, tennis courts, a skate park, playground equipment, and walking/jogging trails.",
    optionB:
      "Natural Conservation Park: Preserve the natural landscape with walking paths, bird watching areas, picnic spots, and native plant gardens.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 10,
    title: "Shopping Center Survey",
    situation:
      "A new shopping center is being planned in your area. The developers are considering two different concepts and want local input.",
    optionA:
      "Large Retail Stores: Include major department stores, electronics retailers, and large chain stores with plenty of parking.",
    optionB:
      "Local Business Focus: Feature small local shops, restaurants, cafes, and service businesses to support the local economy.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 11,
    title: "Public Transit Survey",
    situation:
      "Your region is expanding public transit options and needs to prioritize one of two projects due to budget constraints.",
    optionA:
      "Express Bus Routes: Create fast, direct bus routes connecting suburbs to downtown with limited stops and dedicated lanes.",
    optionB:
      "Local Transit Network: Improve local bus service with more frequent buses, better coverage of residential areas, and lower fares.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 12,
    title: "Healthcare Services Survey",
    situation:
      "Your region is planning to improve healthcare services and has two main proposals. The health authority wants to know which option residents prefer.",
    optionA:
      "Specialist Medical Center: Build a center focusing on specialized care like cardiology, oncology, and surgery with advanced equipment.",
    optionB:
      "Family Health Clinics: Open multiple smaller clinics throughout the region focusing on family medicine, preventive care, and mental health.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 13,
    title: "University Program Survey",
    situation:
      "Your local university is introducing new programs and can only fund one initially. They are asking for community input on which would be most beneficial.",
    optionA:
      "Technology and Innovation Program: Focus on computer science, engineering, and entrepreneurship to prepare students for tech careers.",
    optionB:
      "Sustainability and Environment Program: Focus on environmental science, renewable energy, and sustainable business practices.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 14,
    title: "Senior Services Survey",
    situation:
      "Your community is developing new services for senior citizens and needs to choose between two proposals due to budget limitations.",
    optionA:
      "Senior Activity Center: Build a dedicated center with exercise classes, social activities, educational programs, and meal services.",
    optionB:
      "Home Support Services: Provide in-home care assistance, meal delivery, transportation services, and regular wellness checks.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 15,
    title: "Tourism Development Survey",
    situation:
      "Your city wants to boost tourism and economic development. The tourism board has two strategies and wants resident input.",
    optionA:
      "Cultural Tourism: Develop museums, art galleries, historical sites, and cultural festivals to attract visitors interested in arts and history.",
    optionB:
      "Adventure Tourism: Create outdoor recreational facilities like hiking trails, water sports, camping areas, and adventure tours.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 16,
    title: "Internet Infrastructure Survey",
    situation:
      "Your city is upgrading internet infrastructure and has two approaches. The technology committee wants to know which residents prefer.",
    optionA:
      "Fiber Optic Network: Install high-speed fiber optic cables throughout the city for fastest possible internet speeds.",
    optionB:
      "Public WiFi Expansion: Create free public WiFi hotspots in all public areas, parks, libraries, and community centers.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 17,
    title: "Food Security Survey",
    situation:
      "Your community is addressing food security issues and has two main initiatives. The food security committee wants community input.",
    optionA:
      "Community Gardens: Establish multiple community gardens where residents can grow their own food and learn gardening skills.",
    optionB:
      "Food Bank Expansion: Significantly expand food bank services with more locations, fresh food options, and nutrition education.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 18,
    title: "Youth Programs Survey",
    situation:
      "Your city is expanding youth programs and services. The youth services department has two proposals and wants community feedback.",
    optionA:
      "Sports and Recreation Programs: Expand youth sports leagues, summer camps, and recreational activities with professional coaching.",
    optionB:
      "Educational and Career Programs: Offer tutoring services, job training, internships, and college preparation programs.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 19,
    title: "Emergency Services Survey",
    situation:
      "Your region is improving emergency services and can implement one of two major improvements. The emergency services committee wants public input.",
    optionA:
      "Fire and Rescue Enhancement: Add more fire stations, ambulances, and specialized rescue equipment for faster emergency response.",
    optionB:
      "Emergency Preparedness Program: Develop comprehensive disaster preparedness training, early warning systems, and community response teams.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
  {
    id: 20,
    title: "Economic Development Survey",
    situation:
      "Your city is planning economic development initiatives and has two main strategies. The economic development office wants resident input.",
    optionA:
      "Small Business Support: Provide grants, mentorship programs, and reduced regulations to help local entrepreneurs start and grow businesses.",
    optionB:
      "Attract Large Corporations: Offer tax incentives and infrastructure improvements to attract major companies to relocate to your city.",
    instructions:
      "Choose the option that you prefer. Why do you prefer your choice? Explain the reasons for your choice. Write about 150-200 words.",
  },
];

const emailTasks: EmailTask[] = [
  {
    id: 1,
    title: "Children's Charity Fundraising",
    situation:
      "You are volunteering at a children's charity. You are raising money for a children's activity. Your task is to contact local businesses to raise this money.",
    taskDescription:
      "Write an email to a local company in about 150-200 words.",
    requirements: [
      "Introduce your charity and explain what it does",
      "Explain the activity you are planning",
      "Ask for money and explain how it will be spent",
    ],
  },
  {
    id: 2,
    title: "Hotel Complaint",
    situation:
      "You recently stayed at a hotel during your vacation. Unfortunately, your experience was not satisfactory due to several issues including noise from construction work, a broken air conditioning unit, and poor customer service at the front desk.",
    taskDescription:
      "Write an email to the hotel manager expressing your dissatisfaction with your recent stay in about 150-200 words.",
    requirements: [
      "Explain the specific problems you encountered",
      "Describe how these issues affected your vacation",
      "Request appropriate compensation or resolution",
      "Maintain a professional but firm tone throughout",
    ],
  },
  {
    id: 3,
    title: "Job Application Follow-up",
    situation:
      "You applied for a position at a company two weeks ago and haven't heard back. You are very interested in the position and want to follow up professionally.",
    taskDescription:
      "Write an email to the hiring manager following up on your job application in about 150-200 words.",
    requirements: [
      "Reference your original application and the position",
      "Express your continued interest in the role",
      "Highlight your key qualifications briefly",
      "Request an update on the hiring timeline",
    ],
  },
  {
    id: 4,
    title: "Product Return Request",
    situation:
      "You purchased an electronic device online three days ago, but when it arrived, it was damaged and not working properly. You need to return it for a refund.",
    taskDescription:
      "Write an email to the company's customer service requesting a return and refund in about 150-200 words.",
    requirements: [
      "Provide your order details and purchase information",
      "Describe the problems with the product",
      "Request a return authorization and refund",
      "Ask about the return shipping process",
    ],
  },
  {
    id: 5,
    title: "Apartment Rental Inquiry",
    situation:
      "You saw an advertisement for an apartment rental that interests you. You want to get more information about the property and arrange a viewing.",
    taskDescription:
      "Write an email to the landlord inquiring about the apartment rental in about 150-200 words.",
    requirements: [
      "Express your interest in the advertised apartment",
      "Ask for additional details about the property",
      "Inquire about viewing arrangements",
      "Provide brief information about yourself as a potential tenant",
    ],
  },
  {
    id: 6,
    title: "Course Registration Issue",
    situation:
      "You are trying to register for a course at your local college, but the online system keeps giving you an error message. The registration deadline is approaching.",
    taskDescription:
      "Write an email to the college registration office seeking help with your course registration in about 150-200 words.",
    requirements: [
      "Explain the technical problem you're experiencing",
      "Mention the specific course you want to register for",
      "Express urgency due to the approaching deadline",
      "Request immediate assistance or alternative registration methods",
    ],
  },
  {
    id: 7,
    title: "Gym Membership Cancellation",
    situation:
      "You have been a member of a fitness center for six months, but due to a job relocation, you need to cancel your membership. The contract has a specific cancellation policy.",
    taskDescription:
      "Write an email to the gym management requesting cancellation of your membership in about 150-200 words.",
    requirements: [
      "Explain your reason for cancellation",
      "Reference your membership details",
      "Ask about the cancellation process and any fees",
      "Request confirmation of the cancellation",
    ],
  },
  {
    id: 8,
    title: "Wedding Venue Inquiry",
    situation:
      "You are planning your wedding and found a venue that looks perfect for your special day. You want to check availability and get pricing information.",
    taskDescription:
      "Write an email to the wedding venue coordinator inquiring about availability and services in about 150-200 words.",
    requirements: [
      "Specify your wedding date and expected number of guests",
      "Ask about available packages and pricing",
      "Inquire about included services and restrictions",
      "Request a meeting or venue tour",
    ],
  },
  {
    id: 9,
    title: "Library Book Renewal",
    situation:
      "You borrowed several books from the public library, but you need more time to finish reading them. The due date is tomorrow, and you cannot visit the library in person.",
    taskDescription:
      "Write an email to the library requesting an extension for your borrowed books in about 150-200 words.",
    requirements: [
      "Provide your library card number and contact information",
      "List the books you need to renew",
      "Explain why you cannot return them on time",
      "Request a renewal and ask about any fees",
    ],
  },
  {
    id: 10,
    title: "Event Photography Services",
    situation:
      "You are organizing a corporate event and need to hire a professional photographer. You found a photographer whose portfolio impressed you.",
    taskDescription:
      "Write an email to the photographer inquiring about their services for your event in about 150-200 words.",
    requirements: [
      "Describe your event (date, location, type, duration)",
      "Ask about their availability and pricing",
      "Inquire about package options and deliverables",
      "Request references or examples of similar work",
    ],
  },
  {
    id: 11,
    title: "Medical Appointment Rescheduling",
    situation:
      "You have an important medical appointment scheduled for next week, but a work emergency has come up and you cannot make it at the scheduled time.",
    taskDescription:
      "Write an email to your doctor's office requesting to reschedule your appointment in about 150-200 words.",
    requirements: [
      "Reference your current appointment details",
      "Explain the reason for rescheduling",
      "Suggest alternative dates and times",
      "Apologize for any inconvenience caused",
    ],
  },
  {
    id: 12,
    title: "Volunteer Opportunity Application",
    situation:
      "You saw an advertisement for volunteer opportunities at a local animal shelter. You love animals and want to contribute your time to help.",
    taskDescription:
      "Write an email to the volunteer coordinator expressing your interest in volunteering in about 150-200 words.",
    requirements: [
      "Express your motivation for volunteering",
      "Describe any relevant experience or skills",
      "Ask about the application process and requirements",
      "Indicate your availability and preferred activities",
    ],
  },
  {
    id: 13,
    title: "Catering Service Complaint",
    situation:
      "You hired a catering company for your family celebration last weekend. The food quality was poor, several items were missing, and the service was unprofessional.",
    taskDescription:
      "Write an email to the catering company expressing your dissatisfaction in about 150-200 words.",
    requirements: [
      "Describe the specific problems you experienced",
      "Explain how these issues affected your event",
      "Reference your contract and payment made",
      "Request compensation or a partial refund",
    ],
  },
  {
    id: 14,
    title: "Car Repair Estimate Request",
    situation:
      "Your car was damaged in a minor accident and you need to get it repaired. Your insurance company requires estimates from certified repair shops.",
    taskDescription:
      "Write an email to an auto repair shop requesting an estimate for your car repairs in about 150-200 words.",
    requirements: [
      "Describe the damage to your vehicle",
      "Provide your car's make, model, and year",
      "Ask for a detailed written estimate",
      "Inquire about appointment availability and timeframe",
    ],
  },
  {
    id: 15,
    title: "School Field Trip Permission",
    situation:
      "Your child's teacher has organized an educational field trip to a museum next month. You need to give permission and ask some questions about the trip.",
    taskDescription:
      "Write an email to your child's teacher regarding the upcoming field trip in about 150-200 words.",
    requirements: [
      "Give permission for your child to participate",
      "Ask about transportation and safety arrangements",
      "Inquire about what your child should bring",
      "Provide emergency contact information",
    ],
  },
  {
    id: 16,
    title: "Internet Service Issue",
    situation:
      "Your home internet has been experiencing frequent disconnections and slow speeds for the past week. This is affecting your ability to work from home.",
    taskDescription:
      "Write an email to your internet service provider reporting the technical issues in about 150-200 words.",
    requirements: [
      "Describe the specific problems you're experiencing",
      "Mention how long the issues have been occurring",
      "Explain the impact on your work or daily activities",
      "Request immediate technical support or a service visit",
    ],
  },
  {
    id: 17,
    title: "Restaurant Reservation Confirmation",
    situation:
      "You made a reservation at an upscale restaurant for your anniversary dinner next Saturday. You want to confirm the details and make a special request.",
    taskDescription:
      "Write an email to the restaurant confirming your reservation and making special arrangements in about 150-200 words.",
    requirements: [
      "Confirm your reservation details (date, time, number of people)",
      "Mention the special occasion",
      "Request a specific table location or ambiance",
      "Ask about menu options or dietary accommodations",
    ],
  },
  {
    id: 18,
    title: "Home Insurance Claim",
    situation:
      "A recent storm caused damage to your roof and water leaked into your house, damaging some furniture and electronics. You need to file an insurance claim.",
    taskDescription:
      "Write an email to your insurance company to initiate a claim for storm damage in about 150-200 words.",
    requirements: [
      "Describe the damage caused by the storm",
      "Provide the date and circumstances of the incident",
      "List the damaged items and estimated costs",
      "Request guidance on the claims process and next steps",
    ],
  },
  {
    id: 19,
    title: "Language Course Enrollment",
    situation:
      "You want to improve your language skills and found a language school that offers evening classes. You need information about their programs.",
    taskDescription:
      "Write an email to the language school inquiring about enrollment in their courses in about 150-200 words.",
    requirements: [
      "Specify the language and proficiency level you're interested in",
      "Ask about class schedules and duration",
      "Inquire about fees, materials, and registration process",
      "Request information about teaching methods and class sizes",
    ],
  },
  {
    id: 20,
    title: "Landlord Maintenance Request",
    situation:
      "You are renting an apartment and several maintenance issues have developed: a leaky faucet in the kitchen, a broken window latch, and a malfunctioning heating unit.",
    taskDescription:
      "Write an email to your landlord requesting repairs for multiple maintenance issues in about 150-200 words.",
    requirements: [
      "List all the maintenance problems clearly",
      "Explain how these issues are affecting your daily life",
      "Reference your lease agreement regarding maintenance responsibilities",
      "Request prompt action and ask about scheduling repairs",
    ],
  },
];

export default function WritingSection() {
  const [activeTab, setActiveTab] = useState<"email" | "essay">("email");
  const [selectedSurveyQuestion, setSelectedSurveyQuestion] =
    useState<SurveyQuestion | null>(null);
  const [selectedEmailTask, setSelectedEmailTask] = useState<EmailTask | null>(
    null
  );
  const [userResponse, setUserResponse] = useState("");
  const [timerKey, setTimerKey] = useState(0); // Key to reset timer when switching tasks
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSurveyQuestionSelect = (questionId: number) => {
    const question = surveyQuestions.find((q) => q.id === questionId);
    if (question) {
      setSelectedSurveyQuestion(question);
      setUserResponse("");
      setFeedback(null);
      setTimerKey((prev) => prev + 1);
    }
  };

  const handleEmailTaskSelect = (taskId: number) => {
    const task = emailTasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedEmailTask(task);
      setUserResponse("");
      setFeedback(null);
      setTimerKey((prev) => prev + 1);
    }
  };

  const submitForFeedback = async () => {
    if (!userResponse.trim()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call to LLM for feedback
      // In a real implementation, this would call your LLM API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockFeedback = `Great work! Your response demonstrates clear reasoning and good structure. Here are some specific observations:

**Strengths:**
- Clear position statement
- Good use of examples to support your arguments
- Appropriate word count (${wordCount} words)
- Well-organized structure

**Areas for improvement:**
- Consider adding more specific details to strengthen your examples
- Use more varied transition words to improve flow
- Double-check grammar and punctuation

**Score: 8/10**

This response shows strong critical thinking and persuasive writing skills. Keep practicing to further refine your argumentation techniques.`;

      setFeedback(mockFeedback);
    } catch (error) {
      console.error("Error getting feedback:", error);
      setFeedback(
        "Sorry, there was an error getting feedback. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = userResponse
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

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
              initialMinutes={activeTab === "email" ? 27 : 26}
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
                  setSelectedSurveyQuestion(null);
                  setSelectedEmailTask(null);
                  setUserResponse("");
                  setFeedback(null);
                  setTimerKey((prev) => prev + 1); // Reset timer on tab switch
                }}
                className={`group relative min-w-0 flex-1 overflow-hidden py-4 px-6 text-center text-sm font-medium hover:bg-gray-50 focus:z-10 transition-colors duration-200 focus:outline-none flex flex-col items-center justify-center ${
                  activeTab === tab.key
                    ? "border-primary-500 text-primary-600 border-b-2 bg-white"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                style={activeTab === tab.key ? { fontWeight: 600 } : {}}
              >
                <div className="flex items-center justify-center">
                  {tab.icon}
                  {tab.label}
                </div>
                <span
                  className={`mt-1 text-xs ${
                    activeTab === tab.key ? "text-primary-500" : "text-gray-500"
                  }`}
                >
                  {tab.description}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/* Main Content */}
      {activeTab === "email" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Email Task Selection & Details */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select an Email Task
              </h3>
              <div className="relative">
                <select
                  value={selectedEmailTask?.id || ""}
                  onChange={(e) => {
                    const taskId = parseInt(e.target.value);
                    if (taskId) {
                      handleEmailTaskSelect(taskId);
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                >
                  <option value="">Choose an email task...</option>
                  {emailTasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.id}. {task.title}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {selectedEmailTask && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {selectedEmailTask.title}
                </h2>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Situation:</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedEmailTask.situation}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Task:</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedEmailTask.taskDescription}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Your email should do the following:
                  </h4>
                  <ul className="list-disc list-inside text-blue-800 space-y-1">
                    {selectedEmailTask.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-blue-700 mt-2">
                    <strong>Time limit:</strong> 27 minutes |{" "}
                    <strong>Word count:</strong> 150-200 words
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Writing Space - Always Visible */}
          <div className="card h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Email
              </h3>
              <div className="text-sm text-gray-600">Words: {wordCount}</div>
            </div>

            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder={
                selectedEmailTask
                  ? "Start writing your email here. Remember to include a proper greeting, clear subject matter, and professional closing..."
                  : "Select an email task to begin writing..."
              }
              className="textarea flex-1 mb-4"
              disabled={!selectedEmailTask}
            />

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">Target: 150-200 words</div>
              <button
                onClick={submitForFeedback}
                disabled={!selectedEmailTask || wordCount < 50 || isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <ClockIcon className="w-4 h-4 mr-2 animate-spin" />
                    Getting Feedback...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Submit for Feedback
                  </>
                )}
              </button>
            </div>

            {feedback && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2 flex items-center">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  LLM Feedback
                </h4>
                <div className="text-sm text-green-800 whitespace-pre-line">
                  {feedback}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Survey Questions Section */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Survey Question Selection & Details */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select a Survey Question
              </h3>
              <div className="relative">
                <select
                  value={selectedSurveyQuestion?.id || ""}
                  onChange={(e) => {
                    const questionId = parseInt(e.target.value);
                    if (questionId) {
                      handleSurveyQuestionSelect(questionId);
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                >
                  <option value="">Choose a survey question...</option>
                  {surveyQuestions.map((question) => (
                    <option key={question.id} value={question.id}>
                      {question.id}. {question.title}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {selectedSurveyQuestion && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {selectedSurveyQuestion.title}
                </h2>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Situation:</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedSurveyQuestion.situation}
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Option A:
                    </h4>
                    <p className="text-blue-800">
                      {selectedSurveyQuestion.optionA}
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">
                      Option B:
                    </h4>
                    <p className="text-green-800">
                      {selectedSurveyQuestion.optionB}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-900 mb-2">
                    Instructions:
                  </h4>
                  <p className="text-amber-800">
                    {selectedSurveyQuestion.instructions}
                  </p>
                  <p className="text-sm text-amber-700 mt-2">
                    <strong>Time limit:</strong> 26 minutes
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Writing Space - Always Visible */}
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
              placeholder={
                selectedSurveyQuestion
                  ? "Start writing your survey response here. Choose your preferred option and explain your reasoning with specific examples..."
                  : "Select a survey question to begin writing..."
              }
              className="textarea flex-1 mb-4"
              disabled={!selectedSurveyQuestion}
            />

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">Target: 150-200 words</div>
              <button
                onClick={submitForFeedback}
                disabled={
                  !selectedSurveyQuestion || wordCount < 50 || isSubmitting
                }
                className="btn btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <ClockIcon className="w-4 h-4 mr-2 animate-spin" />
                    Getting Feedback...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Submit for Feedback
                  </>
                )}
              </button>
            </div>

            {feedback && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2 flex items-center">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  LLM Feedback
                </h4>
                <div className="text-sm text-green-800 whitespace-pre-line">
                  {feedback}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
