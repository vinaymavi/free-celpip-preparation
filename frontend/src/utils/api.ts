// API configuration and utility functions
import { langChainService } from "./langchain";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Type definitions for API responses
export interface ReadingPassage {
  title: string;
  content: string;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    questionParts?: {
      before: string;
      after: string;
    };
  }>;
  responseSection?: {
    title: string;
    instruction: string;
    content: string;
    blanks: Array<{
      id: number;
      options: string[];
      correctAnswer: number;
    }>;
  };
}

export interface WritingPrompt {
  title: string;
  prompt: string;
  instructions: string[];
  timeLimit: number;
  wordLimit: string;
}

export interface SpeakingTask {
  title: string;
  instructions: string;
  situation: string;
  timeLimit: string;
  preparationTime: string;
}

export interface ListeningTask {
  title: string;
  transcript: string;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

export interface EvaluationResult {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface ResponseMetadata {
  section: string;
  timestamp: number;
  [key: string]: unknown;
}

// Generic API request function
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("API request failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Reading content generation using LangChain
export async function generateReadingPassage(
  topic?: string
): Promise<ApiResponse<ReadingPassage>> {
  try {
    if (!langChainService.isInitialized()) {
      throw new Error(
        "Language model not initialized. Please configure a model first."
      );
    }

    const data = await langChainService.generateReadingPassage(topic);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to generate reading passage:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate reading passage",
    };
  }
}

// Writing prompt generation using LangChain
export async function generateWritingPrompt(
  type: "email" | "essay"
): Promise<ApiResponse<WritingPrompt>> {
  try {
    if (!langChainService.isInitialized()) {
      throw new Error(
        "Language model not initialized. Please configure a model first."
      );
    }

    const data = await langChainService.generateWritingPrompt(type);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to generate writing prompt:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate writing prompt",
    };
  }
}

// Speaking task generation using LangChain
export async function generateSpeakingTask(
  type?: string
): Promise<ApiResponse<SpeakingTask>> {
  try {
    if (!langChainService.isInitialized()) {
      throw new Error(
        "Language model not initialized. Please configure a model first."
      );
    }

    const data = await langChainService.generateSpeakingTask(type);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to generate speaking task:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate speaking task",
    };
  }
}

// Listening content generation using LangChain
export async function generateListeningTask(): Promise<
  ApiResponse<ListeningTask>
> {
  try {
    if (!langChainService.isInitialized()) {
      throw new Error(
        "Language model not initialized. Please configure a model first."
      );
    }

    const data = await langChainService.generateListeningTask();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to generate listening task:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate listening task",
    };
  }
}

// Submit user response for evaluation using LangChain
export async function submitResponse(
  section: string,
  response: string
): Promise<ApiResponse<EvaluationResult>> {
  try {
    if (!langChainService.isInitialized()) {
      throw new Error(
        "Language model not initialized. Please configure a model first."
      );
    }

    const data = await langChainService.evaluateResponse(section, response);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to evaluate response:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to evaluate response",
    };
  }
}
