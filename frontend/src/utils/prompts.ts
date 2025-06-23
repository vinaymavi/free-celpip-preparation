import { ChatPromptTemplate } from "@langchain/core/prompts";
/**
 * CELPIP Test Prompt Templates
 * This file contains all the prompt templates used for generating test content
 */

export interface PromptTemplates {
  reading: {
    correspondence: ChatPromptTemplate<Record<string, unknown>, string>;
    diagram: ChatPromptTemplate<Record<string, unknown>, string>;
    information: ChatPromptTemplate<Record<string, unknown>, string>;
    viewpoints: ChatPromptTemplate<Record<string, unknown>, string>;
  };
  writing: {
    general: string;
  };
  speaking: {
    general: string;
  };
  listening: {
    general: string;
  };
  evaluation: {
    general: string;
  };
}

export const CELPIP_PROMPTS: PromptTemplates = {
  reading: {
    correspondence: ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are an expert CELPIP test creator. Generate a reading comprehension passage and questions.",
      ],
      [
        "user",
        `
        Topic: {topic}

Please create:
1. A title for the passage (5-8 words)
2. A reading passage (350-400 words) at medium English level CLB 8–10. This passage should be in format of informal email.
3. 7 multiple-choice questions with 4 options each in fill-in-the-blank format
4. A response section passage(200-250 words) with fill-in-the-blank format

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
- Quesion should be coplex to answer, avoid common sense based questions.
- Paraphrase content rather than quoting directly
- Be numbered 1-5

The response section should:
- Be a response to the original email/passage
- Have 8-10 fill-in-the-blank questions numbered sequentially (e.g., 7, 8, 9, 10, 11...)
- Be in the same format as the original passage (formal/informal email/letter)
- Include appropriate greeting and closing matching the original tone
- Fill-in-the-blank questions should complete contextually appropriate responses
- Include a mix of vocabulary, grammar, and comprehension-based blanks
- Be realistic and relevant to the original passage content
- Maintain coherent flow and logical progression in the response
- Use numbered placeholders in curly braces for blanks with sequential numbering
- Each blank should have 4 contextually appropriate options
- Options should be challenging but have one clearly correct answer
- Blanks should test different language skills: vocabulary choice, grammatical correctness, contextual appropriateness

IMPORTANT FORMATTING REQUIREMENTS:
- Use numbered placeholders starting from where the original passage questions ended
- Each blank should be marked with curly braces around sequential numbers
- The response should be 200-300 words long
- Maintain the same level of formality as the original passage
- Include natural transitions and connective phrases
- Ensure grammatical correctness throughout

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
    "content": "Response content with numbered blanks embedded naturally in the text flow. The content should maintain the same tone and format as the original passage.",
    "blanks": [
      {{
        "id": 7,
        "options": ["contextually appropriate option 1", "contextually appropriate option 2", "contextually appropriate option 3", "contextually appropriate option 4"],
        "correctAnswer": 2
      }}
    ]
  }}
}}

In above response section responseSection.content is only for reference. generate your own content.
This response passage should be 200-250 words long and should match the format and tone of the original passage.

Replace numbered blanks with curly braces around sequential numbers starting after the reading questions end.
Ensure correctAnswer is the index (0-3) of the correct option.
Each blank should test different aspects: vocabulary, grammar, context, and reading comprehension.

NOTE: use your knowledge of CELPIP reading test format to generate the passage and questions. Response section should have minimum 5 blanks with sequential numbering.
        `,
      ],
    ]),

    diagram: ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert CELPIP test creator. Generate a reading comprehension passage and questions for the "Reading to Apply a Diagram" section.`,
      ],
      [
        "user",
        `

Topic: {topic}

Please create:
1. A title for the passage (5-8 words)
2. A reading passage (300-350 words) describing visual information
3. 8-9 multiple-choice questions testing diagram interpretation

Format your response as JSON with title, content, and questions array.`,
      ],
    ]),

    information: ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert CELPIP test creator. Generate a reading comprehension passage and questions for the "Reading for Information" section.`,
      ],
      [
        "user",
        `Topic: {topic}

Please create:
1. A title for the passage (5-8 words)
2. A reading passage (400-450 words) that is informative and factual
3. 9-10 multiple-choice questions testing comprehension

Format your response as JSON with title, content, and questions array.`,
      ],
    ]),

    viewpoints: ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert CELPIP test creator. Generate a reading comprehension passage and questions for the "Reading for Viewpoints" section.`,
      ],
      [
        "user",
        `
Topic: {topic}

Please create:
1. A title for the passage (5-8 words)
2. A reading passage (450-500 words) presenting different viewpoints
3. 10-11 multiple-choice questions testing viewpoint understanding

Format your response as JSON with title, content, and questions array.`,
      ],
    ]),
  },

  writing: {
    general: `You are an expert CELPIP test creator. Generate a writing task for the {type} format.

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
- Essay tasks: 26 minutes, 150-200 words`,
  },

  speaking: {
    general: `You are an expert CELPIP test creator. Generate a speaking task.

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
- Expressing opinions`,
  },

  listening: {
    general: `You are an expert CELPIP test creator. Generate a listening comprehension exercise.

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
}}`,
  },

  evaluation: {
    general: `You are an expert CELPIP examiner. Evaluate this {section} response.

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
}}`,
  },
};

/**
 * Helper function to get the appropriate reading prompt template
 */
export function getReadingPromptTemplate(
  sectionType: string
): ChatPromptTemplate<Record<string, unknown>, string> {
  switch (sectionType) {
    case "correspondence":
      return CELPIP_PROMPTS.reading.correspondence;
    case "diagram":
      return CELPIP_PROMPTS.reading.diagram;
    case "information":
      return CELPIP_PROMPTS.reading.information;
    case "viewpoints":
      return CELPIP_PROMPTS.reading.viewpoints;
    default:
      throw new Error(`Unknown reading section type: ${sectionType}`);
  }
}

/**
 * Helper function to get writing prompt template
 */
export function getWritingPromptTemplate(): string {
  return CELPIP_PROMPTS.writing.general;
}

/**
 * Helper function to get speaking prompt template
 */
export function getSpeakingPromptTemplate(): string {
  return CELPIP_PROMPTS.speaking.general;
}

/**
 * Helper function to get listening prompt template
 */
export function getListeningPromptTemplate(): string {
  return CELPIP_PROMPTS.listening.general;
}

/**
 * Helper function to get evaluation prompt template
 */
export function getEvaluationPromptTemplate(): string {
  return CELPIP_PROMPTS.evaluation.general;
}
