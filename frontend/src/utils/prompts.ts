/**
 * CELPIP Test Prompt Templates
 * This file contains all the prompt templates used for generating test content
 */

export interface PromptTemplates {
  reading: {
    correspondence: string;
    diagram: string;
    information: string;
    viewpoints: string;
    default: string;
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
    correspondence: `You are an expert CELPIP test creator. Generate a reading comprehension passage and questions for the "Reading Correspondence" section.

Topic: {topic}

Please create:
1. A title for the passage (5-8 words)
2. A reading passage (350-400 words) in email format
3. 7 multiple-choice questions with fill-in-the-blank format
4. A response section with fill-in-the-blank format

Format your response as JSON with title, content, questions array, and responseSection object.`,

    diagram: `You are an expert CELPIP test creator. Generate a reading comprehension passage and questions for the "Reading to Apply a Diagram" section.

Topic: {topic}

Please create:
1. A title for the passage (5-8 words)
2. A reading passage (300-350 words) describing visual information
3. 8-9 multiple-choice questions testing diagram interpretation

Format your response as JSON with title, content, and questions array.`,

    information: `You are an expert CELPIP test creator. Generate a reading comprehension passage and questions for the "Reading for Information" section.

Topic: {topic}

Please create:
1. A title for the passage (5-8 words)
2. A reading passage (400-450 words) that is informative and factual
3. 9-10 multiple-choice questions testing comprehension

Format your response as JSON with title, content, and questions array.`,

    viewpoints: `You are an expert CELPIP test creator. Generate a reading comprehension passage and questions for the "Reading for Viewpoints" section.

Topic: {topic}

Please create:
1. A title for the passage (5-8 words)
2. A reading passage (450-500 words) presenting different viewpoints
3. 10-11 multiple-choice questions testing viewpoint understanding

Format your response as JSON with title, content, and questions array.`,

    default: `You are an expert CELPIP test creator. Generate a reading comprehension passage and questions.

Topic: {topic}

Please create a JSON response with title, content, and questions array.`,
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
export function getReadingPromptTemplate(sectionType: string): string {
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
      return CELPIP_PROMPTS.reading.default;
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
