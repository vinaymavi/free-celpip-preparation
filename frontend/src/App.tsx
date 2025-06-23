import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpenIcon,
  PencilIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import Layout from "./components/Layout";

type Section = "dashboard" | "reading" | "writing" | "speaking" | "listening";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get current section from URL path
  const currentSection = location.pathname.slice(1) || "dashboard";

  const navigation = [
    { name: "Dashboard", href: "dashboard", icon: BookOpenIcon },
    { name: "Reading", href: "reading", icon: BookOpenIcon },
    { name: "Writing", href: "writing", icon: PencilIcon },
    { name: "Speaking", href: "speaking", icon: MicrophoneIcon },
    { name: "Listening", href: "listening", icon: SpeakerWaveIcon },
  ];

  const handleSectionChange = (section: Section) => {
    navigate(`/${section}`);
  };

  return (
    <Layout
      navigation={navigation}
      currentSection={currentSection}
      onSectionChange={handleSectionChange}
    >
      <Outlet />
    </Layout>
  );
}

export default App;
