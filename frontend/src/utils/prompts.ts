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
- Response should be 200-250 words
- Have 8-10 fill-in-the-blank questions numbered sequentially (e.g., 7, 8, 9, 10, 11...)
- Be in the same format as the original passage (formal/informal email/letter)
- Use numbered placeholders in curly braces for blanks with sequential numbering
- Each blank should have 4 contextually appropriate options
- Options should be challenging atlest have 3-6 words each.
- These options are designed to complete the passge naturally when selected.
- Blanks should test different language skills: vocabulary choice, grammatical correctness, contextual appropriateness

IMPORTANT FORMATTING REQUIREMENTS:
- Use numbered placeholders starting from where the original passage questions ended
- Each blank should be marked with double curly braces around sequential numbers

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

Replace numbered blanks with double curly braces around sequential numbers starting after the reading questions end.
Ensure correctAnswer is the index (0-3) of the correct option.
Each blank should test different aspects: vocabulary, grammar, context, and reading comprehension.

NOTE: use your knowledge of CELPIP reading test format to generate the passage and questions. Response section should have minimum 5 blanks with sequential numbering.
        `,
      ],
    ]),

    diagram: ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert CELPIP test creator. Generating question for  "Reading to Apply a Diagram" section targert CLB 8-10. This section combines visual information with an email message that has fill-in-the-blank questions.`,
      ],
      [
        "user",
        `Topic: {topic}

Please create:
1. A title for the email (5-8 words)
2. A diagram with 4-5 visual elements 
3. An email message (250-300 words) that references the diagram
4. 7 fill-in-the-blank questions embedded in the email

The diagram should contain:
- 4-5 different options/items with distinctive labels
- Create digrams items difficult to compare
- Each item should have 4-6 descriptive properties
- Properties lables can be same/different for different items
- Properties should be factual and comparable/non-comparable
- Visual elements should be clearly distinguishable


The email should:
- Be in informal or semi-formal email format
- Email have good mix of subject and reference the diagram information
- Design email in a complex way by using indirect references to the diagram items
- Use random order of the items in email
- Have 7 fill-in-the-blank questions numbered 1-7
- Fill-in-the-blank questions reference the diagram informaiton
- Use numbered placeholders in double curly braces for blanks
- Questions are designed to complete the email naturally when filled
- Test understanding of diagram information

Each blank should:
- Require information from the diagram to answer correctly
- Have 4 multiple-choice options
- Optoins should have 3-6 words or phrases with reference to the diagrams
- Optoins are designed in a way to challange the test taker by using standard design practices.
- Test different skills of the test taker

IMPORTANT FORMATTING REQUIREMENTS:
- Use numbered placeholders {{1}}, {{2}}, {{3}}, {{4}}, {{5}} for blanks

Format your response as a JSON object with this structure:
{{
  "title": "Email subject line",
  "diagram": {{
    "title": "Diagram title",
    "items": [
      {{
        "id": 1,
        "label": "Item Name (e.g., Train, Bus, Hotel A)",
        "icon": "🚂", // Use appropriate emoji
        "properties": [
          {{"name": "Price", "value": "$200 - return ticket"}},
          {{"name": "Duration", "value": "4 hr, 25 min"}},
          {{"name": "Features", "value": "first-class, scenic trip along the coast, free wi-fi internet"}}
        ]
      }}
    ]
  }},
  "content": "Email content with numbered blanks {{1}}, {{2}}, etc. embedded naturally in the text flow",
  "questions": [
    {{
      "id": 1,
      "options": ["option based on diagram", "option based on diagram", "option based on diagram", "option based on diagram"],
      "correctAnswer": 0
    }}
  ]
}}

Ensure the email content flows naturally and the blanks test comprehension of the diagram information. The diagram items should be realistic and contain specific, comparable details that are referenced in the email blanks.
        `,
      ],
    ]),

    information: ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert CELPIP test creator. Generate content for the "Reading for Information" section (Part 3) which tests the ability to identify newly-learned information that has been rephrased. This section requires matching statements to specific paragraphs.`,
      ],
      [
        "user",
        `Topic: {topic}

Create CELPIP Part 3 Reading for Information content following this exact format:

1. A title for the passage (5-8 words)
2. A reading passage (400-450 words) divided into exactly 4 paragraphs labeled A, B, C, D
3. 6-8 statement-matching questions

PASSAGE REQUIREMENTS:
- Must be exactly 4 paragraphs labeled A, B, C, D
- Each paragraph should be 100-115 words
- Written at CLB 8-10 level (intermediate to advanced)
- Present factual, educational information about the topic
- Each paragraph should contain distinct, specific information
- Include facts, statistics, examples, and detailed explanations
- Information should be dense enough to test precise reading skills

QUESTION REQUIREMENTS:
- Each question presents a statement about information from the passage
- Statements should REPHRASE information from the paragraphs (not quote directly)
- Test ability to recognize information presented in a "completely different way"
- Some statements should be inferable from the text
- Include 1-2 statements where the information is NOT given in any paragraph
- Each question has 5 options: A, B, C, D, E
  - A, B, C, D correspond to paragraphs
  - E means "Information not given in any paragraph"

QUESTION FORMAT:
Each question should contain ONLY the statement to be matched. Do NOT include the instruction text "Decide which paragraph..." in individual questions as this will be displayed as a section header.

EXAMPLE TYPES OF STATEMENTS:
- Rephrased facts from specific paragraphs
- Cause-and-effect relationships mentioned in the text
- Statistical information presented differently
- Benefits/drawbacks mentioned but reworded
- Process steps described in alternative phrasing
- Comparative information restated

Format your response as JSON:
{{
  "title": "Title here",
  "content": "A. [First paragraph content here]\\n\\nB. [Second paragraph content here]\\n\\nC. [Third paragraph content here]\\n\\nD. [Fourth paragraph content here]",
  "questions": [
    {{
      "id": 1,
      "question": "[Statement to be matched]",
      "options": ["A", "B", "C", "D", "E"],
      "correctAnswer": 0
    }}
  ]
}}

IMPORTANT:
- Each paragraph must be clearly labeled with A., B., C., D. at the start
- Statements should require careful reading and cannot be answered through common sense alone
- Include variety: some statements match paragraph A, some B, some C, some D, and 1-2 should be E (not given)
- Focus on testing information identification and rephrasing recognition skills
- Ensure statements are challenging but fair for CLB 8-10 level`,
      ],
    ]),

    viewpoints: ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert CELPIP test creator. Generate content for the "Reading for Viewpoints" section (Part 4) which tests understanding of different opinions and perspectives. This section includes a main article and a reader's comment response.`,
      ],
      [
        "user",
        `Topic: {topic}

Please create:
1. A title for the main article (5-8 words)
2. A main article (450-500 words) presenting at least two different viewpoints/opinions on the topic
3. 5-6 multiple-choice questions about the main article
4. A reader's comment response section with fill-in-the-blank questions

MAIN ARTICLE REQUIREMENTS:
- Present at least two contrasting viewpoints or opinions on the topic
- Include factual information mixed with opinions
- Use phrases like "Some people believe...", "Critics argue...", "Supporters claim...", "However, others think..."
- Written at CLB 8-10 level (intermediate to advanced)
- Clear structure with distinct viewpoints in different paragraphs
- Include reasoning and examples for each viewpoint

MAIN ARTICLE QUESTIONS (5-6 questions):
- Test comprehension of different viewpoints presented
- Questions about opinions vs facts
- Inference questions about author's perspective
- Understanding of contrasting arguments
- Each question has 4 multiple-choice options

READER'S COMMENT SECTION:
- Title: "Reader's Comment"
- A response comment (200-250 words) that references the main article
- Express a clear opinion about the topic discussed in the article
- Include 7-8 fill-in-the-blank questions embedded in the comment
- Use numbered placeholders in curly braces {{1}}, {{2}}, etc.
- Each blank should have 4 contextually appropriate options
- Test vocabulary, context understanding, and opinion comprehension

FORMAT REQUIREMENTS:
Return as JSON with this exact structure:
{{
  "title": "Main article title",
  "content": "Main article content (450-500 words)",
  "questions": [
    {{
      "id": 1,
      "question": "Question about the article",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0
    }}
  ],
  "responseSection": {{
    "title": "Reader's Comment",
    "instruction": "Complete the reader's comment by filling in the blanks. Select the best choice for each blank from the drop-down menu (↓).",
    "content": "Reader's comment content with numbered blanks {{1}}, {{2}}, etc.",
    "blanks": [
      {{
        "id": 1,
        "options": ["option1", "option2", "option3", "option4"],
        "correctAnswer": 0
      }}
    ]
  }}
}}

Ensure questions test different skills: viewpoint recognition, opinion vs fact distinction, inference, and contextual understanding.`,
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
