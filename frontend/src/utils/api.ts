// API configuration and utility functions

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
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

// Reading content generation
export async function generateReadingPassage(
  topic?: string
): Promise<ApiResponse<any>> {
  return apiRequest("/generate/reading", {
    method: "POST",
    body: JSON.stringify({ topic }),
  });
}

// Writing prompt generation
export async function generateWritingPrompt(
  type: "email" | "essay"
): Promise<ApiResponse<any>> {
  return apiRequest("/generate/writing", {
    method: "POST",
    body: JSON.stringify({ type }),
  });
}

// Speaking task generation
export async function generateSpeakingTask(
  type?: string
): Promise<ApiResponse<any>> {
  return apiRequest("/generate/speaking", {
    method: "POST",
    body: JSON.stringify({ type }),
  });
}

// Listening content generation
export async function generateListeningTask(
  type?: string
): Promise<ApiResponse<any>> {
  return apiRequest("/generate/listening", {
    method: "POST",
    body: JSON.stringify({ type }),
  });
}

// Submit user response for evaluation
export async function submitResponse(
  section: string,
  response: string,
  metadata?: any
): Promise<ApiResponse<any>> {
  return apiRequest("/evaluate", {
    method: "POST",
    body: JSON.stringify({ section, response, metadata }),
  });
}
