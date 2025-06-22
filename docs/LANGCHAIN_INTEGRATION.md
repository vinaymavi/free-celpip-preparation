# LangChain.js Integration Guide

## Overview

This CELPIP preparation application now integrates with LangChain.js to generate practice content using various Large Language Models (LLMs). Users can choose from different AI providers and models to generate reading passages, writing prompts, speaking tasks, and listening exercises.

## Supported AI Providers

### 1. OpenAI

- **Models**: GPT-3.5 Turbo, GPT-4, GPT-4 Turbo
- **API Key**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Environment Variable**: `VITE_OPENAI_API_KEY`

### 2. Anthropic

- **Models**: Claude 3 Sonnet, Claude 3 Haiku, Claude 3 Opus
- **API Key**: Get from [Anthropic Console](https://console.anthropic.com/)
- **Environment Variable**: `VITE_ANTHROPIC_API_KEY`

### 3. Google AI

- **Models**: Gemini Pro, Gemini Pro Vision
- **API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Environment Variable**: `VITE_GOOGLE_API_KEY`

### 4. Cohere

- **Models**: Command, Command Light, Command Nightly
- **API Key**: Get from [Cohere Dashboard](https://dashboard.cohere.ai/api-keys)
- **Environment Variable**: `VITE_COHERE_API_KEY`

## Setup Instructions

### 1. Install Dependencies

The following packages are now included:

```bash
npm install langchain @langchain/openai @langchain/anthropic @langchain/google-genai @langchain/cohere @langchain/core
```

### 2. Configure Environment Variables

1. Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Add your API keys to the `.env` file:
   ```bash
   # Only add the keys for providers you plan to use
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
   VITE_GOOGLE_API_KEY=your_google_api_key_here
   VITE_COHERE_API_KEY=your_cohere_api_key_here
   ```

### 3. Model Configuration

1. Click the "Configure LLM" button in any section
2. Select your preferred AI provider
3. Choose a specific model (or use the default)
4. Adjust the temperature (0.0 = focused, 1.0 = creative)
5. Enter your API key (if not set in environment variables)
6. Click "Initialize Model"

## Features

### Reading Section

- **Custom Topics**: Specify topics for passage generation
- **CELPIP Format**: Generates passages with 5 multiple-choice questions
- **Difficulty Levels**: Intermediate to advanced English level content
- **Real-time Generation**: Uses selected LLM to create unique content

### Writing Section

- **Prompt Types**: Email and essay prompts
- **Realistic Scenarios**: Canadian context and everyday situations
- **Time Limits**: Matches CELPIP test timing
- **Clear Instructions**: Detailed requirements for each task

### Speaking Section

- **Task Variety**: Personal experiences, advice-giving, comparisons
- **Preparation Time**: Includes prep and speaking time guidelines
- **Situational Context**: Real-world scenarios

### Listening Section

- **Transcript Generation**: Creates realistic dialogues and monologues
- **Comprehension Questions**: Tests main ideas, details, and inferences
- **Canadian Context**: Uses Canadian English patterns

### Response Evaluation

- **CELPIP Scoring**: 12-point scale evaluation
- **Detailed Feedback**: Strengths and improvement areas
- **Multiple Criteria**: Content, vocabulary, grammar, organization

## Usage Tips

### Model Selection

- **GPT-3.5 Turbo**: Fast, cost-effective, good for most tasks
- **GPT-4**: Higher quality, better reasoning, more expensive
- **Claude 3 Sonnet**: Balanced performance and cost
- **Gemini Pro**: Good alternative with competitive performance
- **Cohere Command**: Optimized for business/professional content

### Temperature Settings

- **0.0-0.3**: More focused and consistent outputs
- **0.4-0.7**: Balanced creativity and consistency (recommended)
- **0.8-1.0**: More creative and varied outputs

### API Key Security

⚠️ **Important**: API keys are exposed in the frontend bundle. For production:

- Use environment variables with restricted keys
- Implement rate limiting
- Consider a backend proxy for API calls
- Monitor usage and costs

## Troubleshooting

### Common Issues

1. **"Language model not initialized"**

   - Configure a model using the model selector
   - Ensure API key is valid and has sufficient credits

2. **"Failed to generate content"**

   - Check internet connection
   - Verify API key permissions
   - Try a different model or provider

3. **"No valid JSON found in response"**

   - The AI model output was malformed
   - Try regenerating or adjusting temperature

4. **Rate limiting errors**
   - Reduce generation frequency
   - Upgrade API plan if needed
   - Try a different provider

### Error Messages

- Check browser console for detailed error logs
- Verify environment variables are properly set
- Ensure API keys have appropriate permissions

## API Costs

Be aware of API usage costs:

- **OpenAI**: Varies by model (~$0.002-0.06 per 1K tokens)
- **Anthropic**: ~$0.008-0.024 per 1K tokens
- **Google**: ~$0.001-0.002 per 1K characters
- **Cohere**: ~$0.002-0.015 per 1K tokens

Monitor usage through provider dashboards.

## Architecture

### LangChain Service (`utils/langchain.ts`)

- Handles model initialization and switching
- Provides unified interface for all providers
- Manages prompt templates and response parsing

### API Layer (`utils/api.ts`)

- Integrates with LangChain service
- Provides typed interfaces for all content types
- Handles error management and response formatting

### UI Components

- **ModelSelector**: Configure and switch between models
- **Section Components**: Updated to use LangChain-generated content
- **Error Handling**: User-friendly error messages and recovery

## Future Enhancements

Potential improvements:

- Backend API proxy for secure key management
- User preference storage for model settings
- Content caching to reduce API calls
- Batch processing for multiple generations
- Custom prompt templates
- Advanced evaluation criteria
- Progress tracking and analytics
