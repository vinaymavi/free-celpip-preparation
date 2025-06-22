import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatCohere } from "@langchain/cohere";
import { PromptTemplate } from "@langchain/core/prompts";
import { BaseLanguageModel } from "@langchain/core/language_models/base";

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
  openai: "o4-mini",
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
  async generateReadingPassage(topic?: string): Promise<{
    title: string;
    content: string;
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

    const prompt = PromptTemplate.fromTemplate(`
You are an expert CELPIP test creator. Generate a reading comprehension passage and questions.

Topic: {topic}
wedding

Please create:
1. A title for the passage (5-8 words)
2. A reading passage (800-1000 words) at advanced English level. This passage should be in format of informal email.
3. 5 multiple-choice questions with 4 options each

The passage should be:
- Informative and engaging
- Similar to CELPIP reading test format
- Appropriate for English language learners
- Well-structured with clear paragraphs

Each question should:
- Test comprehension, inference, or vocabulary
- Have one clearly correct answer
- Include plausible distractors
- Be numbered 1-5

Format your response as a JSON object with this structure:
{{
  "title": "Your title here",
  "content": "Your passage here with proper paragraph breaks using \\n\\n",
  "questions": [
    {{
      "id": 1,
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }}
  ]
}}

Ensure correctAnswer is the index (0-3) of the correct option.
`);

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
      throw new Error("Failed to generate reading passage");
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

    const prompt = PromptTemplate.fromTemplate(`
You are an expert CELPIP test creator. Generate a writing task for the {type} format.

Create a {type} writing prompt that:
- Is realistic and relevant to everyday situations
- Matches CELPIP test standards
- Is appropriate for intermediate to advanced English learners
- Provides clear context and requirements

For email prompts: Include a realistic scenario requiring formal or informal communication
For essay prompts: Present a topic that allows for personal opinion and argumentation

Format your response as a JSON object:
{{
  "title": "Brief title for the task",
  "prompt": "The main writing prompt/scenario",
  "instructions": ["Instruction 1", "Instruction 2", "Instruction 3"],
  "timeLimit": {timeLimit},
  "wordLimit": "{wordLimit}"
}}

Use these guidelines:
- Email tasks: 27 minutes, 150-200 words
- Essay tasks: 26 minutes, 150-200 words
`);

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

    const prompt = PromptTemplate.fromTemplate(`
You are an expert CELPIP test creator. Generate a speaking task.

Task type: {taskType}

Create a speaking task that:
- Is realistic and relevant to everyday Canadian situations
- Matches CELPIP speaking test format
- Allows for natural conversation and personal expression
- Is appropriate for intermediate to advanced English learners

Format your response as a JSON object:
{{
  "title": "Brief title for the task",
  "instructions": "Clear instructions for the speaking task",
  "situation": "Detailed scenario or context",
  "timeLimit": "Time allowed for speaking",
  "preparationTime": "Time allowed for preparation"
}}

Common CELPIP speaking tasks include:
- Giving advice
- Talking about personal experiences
- Describing situations
- Making comparisons
- Expressing opinions
`);

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

    const prompt = PromptTemplate.fromTemplate(`
You are an expert CELPIP test creator. Generate a listening comprehension exercise.

Create:
1. A realistic dialogue or monologue (200-300 words)
2. 4-5 comprehension questions with multiple-choice answers

The audio content should:
- Represent realistic Canadian English conversations
- Include everyday situations (workplace, community, social)
- Use natural speech patterns and vocabulary
- Be at intermediate to advanced level

Questions should test:
- Main ideas and details
- Inferences and implications
- Speaker attitudes and purposes

Format your response as a JSON object:
{{
  "title": "Brief title for the listening task",
  "transcript": "Full transcript of the audio content",
  "questions": [
    {{
      "id": 1,
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }}
  ]
}}
`);

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

    const prompt = PromptTemplate.fromTemplate(`
You are an expert CELPIP examiner. Evaluate this {section} response.

User Response:
{userResponse}

Evaluation Criteria: {criteria}

Provide:
1. A score out of 12 (CELPIP scale)
2. Overall feedback
3. 2-3 key strengths
4. 2-3 areas for improvement

Consider CELPIP criteria:
- Content/Ideas
- Vocabulary
- Grammar
- Organization/Coherence
- Task fulfillment

Format as JSON:
{{
  "score": 8,
  "feedback": "Overall assessment...",
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement 1", "Improvement 2"]
}}
`);

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
