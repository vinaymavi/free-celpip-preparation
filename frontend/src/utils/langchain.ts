import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatCohere } from "@langchain/cohere";
import { PromptTemplate } from "@langchain/core/prompts";
import { BaseLanguageModel } from "@langchain/core/language_models/base";
import {
  getReadingPromptTemplate,
  getWritingPromptTemplate,
  getSpeakingPromptTemplate,
  getListeningPromptTemplate,
  getEvaluationPromptTemplate,
} from "./prompts";

// Supported LLM providers
export type LLMProvider = "openai" | "anthropic" | "google" | "cohere";

// Model configuration interface
export interface ModelConfig {
  provider: LLMProvider;
  model?: string;
  temperature?: number;
  apiKey?: string;
}

// Default model configurations
const DEFAULT_MODELS: Record<LLMProvider, string> = {
  openai: "gpt-4.1",
  anthropic: "claude-3-sonnet-20240229",
  google: "gemini-pro",
  cohere: "command-light",
};

// LangChain service class
export class LangChainService {
  private llm: BaseLanguageModel | null = null;
  private currentConfig: ModelConfig | null = null;

  /**
   * Initialize the LLM with the specified configuration
   */
  async initializeLLM(config: ModelConfig): Promise<void> {
    try {
      const model = config.model || DEFAULT_MODELS[config.provider];
      const temperature = config.temperature || 0.7;

      switch (config.provider) {
        case "openai":
          this.llm = new ChatOpenAI({
            modelName: model,
            temperature,
            openAIApiKey: config.apiKey || import.meta.env.VITE_OPENAI_API_KEY,
          });
          break;

        case "anthropic":
          this.llm = new ChatAnthropic({
            modelName: model,
            temperature,
            anthropicApiKey:
              config.apiKey || import.meta.env.VITE_ANTHROPIC_API_KEY,
          });
          break;

        case "google":
          this.llm = new ChatGoogleGenerativeAI({
            model,
            temperature,
            apiKey: config.apiKey || import.meta.env.VITE_GOOGLE_API_KEY,
          });
          break;

        case "cohere":
          this.llm = new ChatCohere({
            model,
            temperature,
            apiKey: config.apiKey || import.meta.env.VITE_COHERE_API_KEY,
          });
          break;

        default:
          throw new Error(`Unsupported provider: ${config.provider}`);
      }

      this.currentConfig = config;
    } catch (error) {
      console.error("Failed to initialize LLM:", error);
      throw new Error(
        `Failed to initialize ${config.provider} model: ${error}`
      );
    }
  }

  /**
   * Generate reading passage with questions
   */
  async generateReadingPassage(
    topic?: string,
    sectionType: string = "correspondence"
  ): Promise<{
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
  }> {
    if (!this.llm) {
      throw new Error("LLM not initialized. Call initializeLLM first.");
    }

    const prompt = PromptTemplate.fromTemplate(
      getReadingPromptTemplate(sectionType)
    );

    try {
      const formattedPrompt = await prompt.format({
        topic: topic || "a relevant topic for English learners",
      });

      const response = await this.llm.invoke(formattedPrompt);
      const content =
        typeof response.content === "string"
          ? response.content
          : response.content.toString();

      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      // Validate the response structure
      if (
        !parsedResponse.title ||
        !parsedResponse.content ||
        !parsedResponse.questions
      ) {
        throw new Error("Invalid response structure");
      }

      return parsedResponse;
    } catch (error) {
      console.error("Failed to generate reading passage:", error);

      // Create a meaningful error message based on the error type
      let errorMessage = "Failed to generate reading passage. ";

      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          errorMessage += "Please check your API key configuration.";
        } else if (error.message.includes("rate limit")) {
          errorMessage += "API rate limit exceeded. Please try again later.";
        } else if (error.message.includes("JSON")) {
          errorMessage +=
            "Unable to process the generated content. Please try again.";
        } else if (error.message.includes("initialize")) {
          errorMessage +=
            "AI model not properly configured. Please select a model first.";
        } else {
          errorMessage += `${error.message}`;
        }
      } else {
        errorMessage += "An unexpected error occurred. Please try again.";
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Generate writing prompt
   */
  async generateWritingPrompt(type: "email" | "essay"): Promise<{
    title: string;
    prompt: string;
    instructions: string[];
    timeLimit: number;
    wordLimit: string;
  }> {
    if (!this.llm) {
      throw new Error("LLM not initialized. Call initializeLLM first.");
    }

    const prompt = PromptTemplate.fromTemplate(getWritingPromptTemplate());

    try {
      const timeLimit = type === "email" ? 27 : 26;
      const wordLimit = "150-200 words";

      const formattedPrompt = await prompt.format({
        type,
        timeLimit,
        wordLimit,
      });

      const response = await this.llm.invoke(formattedPrompt);
      const content =
        typeof response.content === "string"
          ? response.content
          : response.content.toString();

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Failed to generate writing prompt:", error);
      throw new Error("Failed to generate writing prompt");
    }
  }

  /**
   * Generate speaking task
   */
  async generateSpeakingTask(taskType?: string): Promise<{
    title: string;
    instructions: string;
    situation: string;
    timeLimit: string;
    preparationTime: string;
  }> {
    if (!this.llm) {
      throw new Error("LLM not initialized. Call initializeLLM first.");
    }

    const prompt = PromptTemplate.fromTemplate(getSpeakingPromptTemplate());

    try {
      const formattedPrompt = await prompt.format({
        taskType: taskType || "personal experience or advice",
      });

      const response = await this.llm.invoke(formattedPrompt);
      const content =
        typeof response.content === "string"
          ? response.content
          : response.content.toString();

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Failed to generate speaking task:", error);
      throw new Error("Failed to generate speaking task");
    }
  }

  /**
   * Generate listening task
   */
  async generateListeningTask(): Promise<{
    title: string;
    transcript: string;
    questions: Array<{
      id: number;
      question: string;
      options: string[];
      correctAnswer: number;
    }>;
  }> {
    if (!this.llm) {
      throw new Error("LLM not initialized. Call initializeLLM first.");
    }

    const prompt = PromptTemplate.fromTemplate(getListeningPromptTemplate());

    try {
      const formattedPrompt = await prompt.format({});
      const response = await this.llm.invoke(formattedPrompt);
      const content =
        typeof response.content === "string"
          ? response.content
          : response.content.toString();

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Failed to generate listening task:", error);
      throw new Error("Failed to generate listening task");
    }
  }

  /**
   * Evaluate user response
   */
  async evaluateResponse(
    section: string,
    userResponse: string,
    criteria?: string[]
  ): Promise<{
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  }> {
    if (!this.llm) {
      throw new Error("LLM not initialized. Call initializeLLM first.");
    }

    const prompt = PromptTemplate.fromTemplate(getEvaluationPromptTemplate());

    try {
      const formattedPrompt = await prompt.format({
        section,
        userResponse,
        criteria: criteria?.join(", ") || "CELPIP standard criteria",
      });

      const response = await this.llm.invoke(formattedPrompt);
      const content =
        typeof response.content === "string"
          ? response.content
          : response.content.toString();

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Failed to evaluate response:", error);
      throw new Error("Failed to evaluate response");
    }
  }

  /**
   * Get current model information
   */
  getCurrentModel(): ModelConfig | null {
    return this.currentConfig;
  }

  /**
   * Check if LLM is initialized
   */
  isInitialized(): boolean {
    return this.llm !== null;
  }
}

// Export singleton instance
export const langChainService = new LangChainService();
