import { useState } from "react";
import {
  BookOpenIcon,
  PencilIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import ReadingSection from "./components/ReadingSection";
import WritingSection from "./components/WritingSection";
import SpeakingSection from "./components/SpeakingSection";
import ListeningSection from "./components/ListeningSection";

type Section = "dashboard" | "reading" | "writing" | "speaking" | "listening";

function App() {
  const [currentSection, setCurrentSection] = useState<Section>("dashboard");

  const navigation = [
    { name: "Dashboard", href: "dashboard", icon: BookOpenIcon },
    { name: "Reading", href: "reading", icon: BookOpenIcon },
    { name: "Writing", href: "writing", icon: PencilIcon },
    { name: "Speaking", href: "speaking", icon: MicrophoneIcon },
    { name: "Listening", href: "listening", icon: SpeakerWaveIcon },
  ];

  const renderSection = () => {
    switch (currentSection) {
      case "reading":
        return <ReadingSection />;
      case "writing":
        return <WritingSection />;
      case "speaking":
        return <SpeakingSection />;
      case "listening":
        return <ListeningSection />;
      default:
        return <Dashboard onSectionSelect={setCurrentSection} />;
    }
  };

  return (
    <Layout
      navigation={navigation}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
    >
      {renderSection()}
    </Layout>
  );
}

export default App;
