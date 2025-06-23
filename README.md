# CELPIP Preparation Application

A comprehensive web application for CELPIP (Canadian English Language Proficiency Index Program) test preparation, featuring AI-powered content generation using LangChain.js.

## 🚀 Features

### Core CELPIP Sections

- **Reading Comprehension**: Practice with passages and multiple-choice questions
- **Writing Tasks**: Email and essay prompts with guided instructions
- **Speaking Practice**: Situational tasks and personal experience questions
- **Listening Comprehension**: Audio transcripts with comprehension questions

### 🤖 AI-Powered Content Generation

- **Multiple LLM Support**: Choose from OpenAI, Anthropic, Google AI, and Cohere models
- **Dynamic Content**: Generate unique practice materials on-demand
- **Customizable Topics**: Specify subjects for targeted practice
- **CELPIP-Aligned**: Content matches official test format and difficulty
- **Response Evaluation**: AI-powered feedback on your practice responses

### 🧭 Navigation & Routing

- **Client-Side Routing**: Seamless navigation between sections without page reloads
- **Direct URL Access**: Share or bookmark specific sections (e.g., `/reading`, `/writing`)
- **Browser Navigation**: Full support for back/forward buttons and browser history
- **Mobile-Friendly**: Responsive navigation with hamburger menu for mobile devices

## 🛠 Technology Stack

### Frontend

- **React 19** with TypeScript
- **React Router v7** for client-side routing and navigation
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **Headless UI** for accessible components
- **Heroicons** for consistent iconography

### AI Integration

- **LangChain.js** for LLM orchestration
- **OpenAI GPT Models** (GPT-3.5, GPT-4)
- **Anthropic Claude** (Claude 3 Sonnet, Haiku, Opus)
- **Google Gemini** (Gemini Pro)
- **Cohere Command** models

## 📋 Prerequisites

- Node.js 18+ and npm
- API keys for at least one LLM provider:
  - OpenAI API key
  - Anthropic API key
  - Google AI API key
  - Cohere API key

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd free-celpip-preparation/frontend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```bash
# Add keys for the providers you want to use
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_COHERE_API_KEY=your_cohere_api_key_here
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to start practicing!

## 🔧 Configuration

### Model Selection

1. Click "Configure LLM" in any section
2. Choose your preferred AI provider
3. Select a specific model
4. Adjust temperature (creativity level)
5. Initialize the model

### Recommended Settings

- **For consistent results**: Temperature 0.2-0.4
- **For creative content**: Temperature 0.6-0.8
- **Best overall model**: GPT-4 or Claude 3 Sonnet
- **Most economical**: GPT-3.5 Turbo or Command Light

## 📚 Usage Guide

### Reading Section

1. Configure an AI model
2. Optionally specify a topic
3. Generate passage and questions
4. Complete the practice test
5. Review results and explanations

### Writing Section

1. Choose email or essay format
2. Generate a prompt using AI
3. Write your response
4. Submit for AI evaluation
5. Review detailed feedback

### Speaking & Listening

- Similar workflow with section-specific content
- Realistic Canadian scenarios
- Timed practice sessions

## 🔒 Security Notes

⚠️ **Important**: API keys are exposed in the frontend bundle. For production use:

- Implement a backend API proxy
- Use environment-specific keys with rate limits
- Monitor API usage and costs
- Consider server-side rendering for key security

## 💰 API Costs

Approximate costs per generation:

- **OpenAI GPT-3.5**: ~$0.002 per request
- **OpenAI GPT-4**: ~$0.02-0.06 per request
- **Anthropic Claude**: ~$0.008-0.024 per request
- **Google Gemini**: ~$0.001-0.002 per request
- **Cohere**: ~$0.002-0.015 per request

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📖 Documentation

- [LangChain Integration Guide](docs/LANGCHAIN_INTEGRATION.md)
- [Development Setup](docs/DEVELOPMENT.md)
- [API Integration](docs/API_INTEGRATION.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:

1. Check the [documentation](docs/)
2. Search existing GitHub issues
3. Create a new issue with detailed information

---

**Note**: This application is for practice purposes only and is not affiliated with the official CELPIP test administrators.
