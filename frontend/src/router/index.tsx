import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Dashboard from "../components/Dashboard";
import ReadingSection from "../components/ReadingSection";
import WritingSection from "../components/WritingSection";
import SpeakingSection from "../components/SpeakingSection";
import ListeningSection from "../components/ListeningSection";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "reading",
        element: <ReadingSection />,
      },
      {
        path: "writing",
        element: <WritingSection />,
      },
      {
        path: "speaking",
        element: <SpeakingSection />,
      },
      {
        path: "listening",
        element: <ListeningSection />,
      },
    ],
  },
]);
