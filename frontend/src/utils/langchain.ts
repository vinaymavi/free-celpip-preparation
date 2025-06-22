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

    const prompt = PromptTemplate.fromTemplate(`
You are an expert CELPIP test creator. Generate a reading comprehension passage and questions.

Topic: {topic}

Please create:
1. A title for the passage (5-8 words)
2. A reading passage (800-1000 words) at advanced English level. This passage should be in format of informal email.
3. 5 multiple-choice questions with 4 options each in fill-in-the-blank format
4. A response section with fill-in-the-blank format

The passage should be:
- Informative and engaging
- Similar to CELPIP reading test format
- Appropriate for English language learners
- Well-structured with clear paragraphs
- In email format (Hi [Name], ... Love, [Sender])

Each question should be in fill-in-the-blank format:
- Have questionParts with "before" and "after" text around the blank
- Test comprehension, inference, or vocabulary
- Have one clearly correct answer
- Include 4 plausible options
- Be numbered 1-5

The response section should:
- Be a response to the original email/passage
- Have 3-5 fill-in-the-blank questions
- Use placeholders like number in curly braces in the content
- Include realistic options for each blank

Format your response as a JSON object with this structure:
{{
  "title": "Your title here",
  "content": "Your passage here with proper paragraph breaks using \\n\\n",
  "questions": [
    {{
      "id": 1,
      "questionParts": {{
        "before": "Text before the blank",
        "after": "text after the blank."
      }},
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }}
  ],
  "responseSection": {{
    "title": "Complete the response",
    "instruction": "Here is a response to the message. Complete the response by filling in the blanks. Select the best choice for each blank from the drop-down menu (↓).",
    "content": "Hi [Name],\\n\\nThis is such wonderful news! Count us in, we would hate to miss BLANK1. We'll leave BLANK2 at 6am Saturday morning. We'll be there by early afternoon. That way if you need any help setting up the BLANK3, you'll have some extra help. Cindy is great with decorations.\\n\\nAlso, we want to give Marcus a gift. Actually we thought about a sofa for his new apartment, but I guess that BLANK4. Do you think he has enough BLANK5? Does he have everything he needs for the winter - warm clothes, perhaps?\\n\\nLet me know, and see you on Saturday!\\n\\nLove,\\nMea",
    "blanks": [
      {{
        "id": 1,
        "options": ["trip", "party", "move", "graduation"],
        "correctAnswer": 1
      }},
      {{
        "id": 2,  
        "options": ["early", "late", "tomorrow", "tonight"],
        "correctAnswer": 0
      }},
      {{
        "id": 3,
        "options": ["party", "house", "apartment", "room"],
        "correctAnswer": 0
      }},
      {{
        "id": 4,
        "options": ["won't fit", "is too expensive", "isn't needed", "won't work"],
        "correctAnswer": 0
      }},
      {{
        "id": 5,
        "options": ["furniture", "clothes", "food", "money"],
        "correctAnswer": 1
      }}
    ]
  }}
}}

Replace BLANK1, BLANK2, etc. with curly braces around the numbers like this: curly brace 1 curly brace, curly brace 2 curly brace, etc.
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

      // Return sample data as fallback for demonstration
      return {
        title: "Planning Maria's Birthday Celebration",
        content:
          "Hi Maria,\n\nThis is such wonderful news! I'm so excited to help you plan your birthday celebration. Count us in - we would hate to miss such a special occasion. We'll leave early on Saturday morning around 6am so we can be there by early afternoon. That way, if you need any help setting up the party, you'll have some extra hands. Cindy is particularly great with decorations and has lots of creative ideas.\n\nAlso, we want to give you a meaningful gift for this milestone birthday. We actually thought about getting you a beautiful sofa for your new apartment, but I guess that won't fit through your narrow stairway. Do you think you have enough warm clothes for the upcoming winter? Does he have everything you need for the colder months - perhaps some cozy sweaters or a warm coat?\n\nI remember last year's celebration was absolutely fantastic, and I know this one will be even better. We're bringing some homemade cookies and party games that everyone will enjoy.\n\nLet me know if there's anything specific you'd like us to bring, and we'll see you on Saturday!\n\nLove,\nMea",
        questions: [
          {
            id: 1,
            question: "Fill in the blank",
            questionParts: {
              before: "The writer says they will leave",
              after: "on Saturday morning.",
            },
            options: ["late", "early", "at noon", "in the evening"],
            correctAnswer: 1,
          },
          {
            id: 2,
            question: "Fill in the blank",
            questionParts: {
              before: "Cindy is particularly good with",
              after: "according to the email.",
            },
            options: ["cooking", "decorations", "music", "photography"],
            correctAnswer: 1,
          },
          {
            id: 3,
            question: "Fill in the blank",
            questionParts: {
              before: "The writers wanted to buy Maria a",
              after: "but decided against it.",
            },
            options: ["television", "painting", "sofa", "lamp"],
            correctAnswer: 2,
          },
          {
            id: 4,
            question: "Fill in the blank",
            questionParts: {
              before: "The sofa won't fit because of the apartment's",
              after: "according to the writer.",
            },
            options: [
              "narrow stairway",
              "small rooms",
              "low ceiling",
              "old elevator",
            ],
            correctAnswer: 0,
          },
          {
            id: 5,
            question: "Fill in the blank",
            questionParts: {
              before: "The writers are planning to bring",
              after: "to the celebration.",
            },
            options: [
              "flowers and wine",
              "music and dancing",
              "homemade cookies and party games",
              "decorations and balloons",
            ],
            correctAnswer: 2,
          },
        ],
        responseSection: {
          title: "Complete the response",
          instruction:
            "Here is a response to the message. Complete the response by filling in the blanks. Select the best choice for each blank from the drop-down menu (↓).",
          content:
            "Hi Mea,\n\nThank you so much for your lovely email! I'm thrilled that you can make it to my {1}. It means the world to me to have such wonderful friends celebrating with me.\n\nYour offer to help with the {2} is so generous. I would love Cindy's help with the decorations - she always has such creative ideas! And arriving early on {3} morning would be perfect timing.\n\nAs for the gift, please don't worry about the sofa situation. You're absolutely right about the {4} - it's quite narrow and we'd never get it up there! Actually, I do need some warm clothes for winter. A cozy {5} would be wonderful, especially with the cold weather approaching.\n\nI can't wait to see you both and enjoy your famous homemade cookies!\n\nWith love and gratitude,\nMaria",
          blanks: [
            {
              id: 1,
              options: ["wedding", "party", "graduation", "anniversary"],
              correctAnswer: 1,
            },
            {
              id: 2,
              options: ["cooking", "decorations", "cleaning", "shopping"],
              correctAnswer: 1,
            },
            {
              id: 3,
              options: ["Sunday", "Saturday", "Friday", "Monday"],
              correctAnswer: 1,
            },
            {
              id: 4,
              options: ["elevator", "stairway", "doorway", "hallway"],
              correctAnswer: 1,
            },
            {
              id: 5,
              options: ["hat", "sweater", "scarf", "jacket"],
              correctAnswer: 1,
            },
          ],
        },
      };
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
