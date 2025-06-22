# Free CELPIP Preparation Platform

A modern, interactive web application for CELPIP (Canadian English Language Proficiency Index Program) test preparation, featuring AI-generated content and comprehensive practice materials.

## Features

### 🎯 Four Main Sections

- **Reading Comprehension**: Practice with AI-generated passages and multiple-choice questions
- **Writing Tasks**: Email writing and essay composition with guided prompts
- **Speaking Practice**: Simulated speaking tasks with preparation and response timers
- **Listening Comprehension**: Audio-based exercises with comprehension questions

### 🚀 Key Capabilities

- **AI-Generated Content**: Unlimited practice materials created on-demand
- **Interactive Interface**: Modern, responsive design with intuitive navigation
- **Timer-Based Practice**: Realistic test conditions with time limits
- **Immediate Feedback**: Instant scoring and detailed results
- **Progress Tracking**: Monitor improvement across all sections
- **Mobile Responsive**: Practice anywhere, on any device

## Technology Stack

### Frontend

- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** for modern, responsive styling
- **Vite** for fast development and building
- **Headless UI** for accessible components
- **Heroicons** for beautiful icons

### Styling & UI

- Custom design system with consistent color palette
- Responsive grid layouts for all screen sizes
- Smooth animations and transitions
- Accessible form components

## Project Structure

```
free-celpip-preparation/
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Dashboard.tsx  # Main dashboard with section overview
│   │   │   ├── Layout.tsx     # App layout with navigation
│   │   │   ├── ReadingSection.tsx    # Reading comprehension practice
│   │   │   ├── WritingSection.tsx    # Writing task practice
│   │   │   ├── SpeakingSection.tsx   # Speaking task simulation
│   │   │   └── ListeningSection.tsx  # Listening comprehension
│   │   ├── App.tsx           # Main app component
│   │   ├── index.css         # Tailwind CSS styles
│   │   └── main.tsx          # App entry point
│   ├── public/               # Static assets
│   ├── index.html           # HTML template
│   ├── package.json         # Dependencies and scripts
│   ├── tailwind.config.js   # Tailwind configuration
│   ├── postcss.config.js    # PostCSS configuration
│   └── vite.config.ts       # Vite configuration
├── prompts.md               # LLM prompts for content generation
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/free-celpip-preparation.git
   cd free-celpip-preparation
   ```

2. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Building for Production

```bash
cd frontend
npm run build
```

The built files will be in the `dist/` directory.

## Usage Guide

### Dashboard

- Start from the main dashboard to see all available sections
- Click on any section card to begin practice
- View progress statistics and features overview

### Reading Section

1. Click "Generate Passage" to create a new reading comprehension exercise
2. Read the passage carefully (typically 500-600 words)
3. Answer all multiple-choice questions
4. Submit your answers to see results and explanations

### Writing Section

1. Choose between Email Writing or Essay Writing
2. Read the prompt and requirements carefully
3. Use the built-in timer to simulate test conditions
4. Write your response in the provided text area
5. Monitor word count and time remaining

### Speaking Section

1. Generate a random speaking task
2. Review the prompt during preparation time (30 seconds)
3. Speak your response during recording time (60-90 seconds)
4. Practice different task types: personal experience, scene description, predictions, and opinions

### Listening Section

1. Generate a listening comprehension task
2. Play the audio clip (simulated in demo)
3. Answer comprehension questions based on what you heard
4. Review transcript for learning purposes

## Customization

### Adding New Content

The application uses simulated AI-generated content. To integrate with real AI services:

1. **Reading Passages**: Update the `generatePassage` function in `ReadingSection.tsx`
2. **Writing Prompts**: Modify the `generatePrompt` function in `WritingSection.tsx`
3. **Speaking Tasks**: Enhance the `generateTask` function in `SpeakingSection.tsx`
4. **Listening Content**: Update the `generateTask` function in `ListeningSection.tsx`

### Styling Customization

- Edit `tailwind.config.js` to modify the design system
- Update colors, fonts, and spacing in the theme configuration
- Customize component styles in `src/index.css`

### Adding Features

- Create new components in the `src/components/` directory
- Add new routes and navigation items in `App.tsx`
- Extend the type definitions for new data structures

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

### Planned Features

- [ ] Real AI integration for content generation
- [ ] User authentication and progress tracking
- [ ] Audio recording and playback functionality
- [ ] Performance analytics and detailed feedback
- [ ] Offline practice mode
- [ ] Multiple difficulty levels
- [ ] Customizable practice sessions
- [ ] Export progress reports

### Technical Improvements

- [ ] Backend API development
- [ ] Database integration
- [ ] Real-time collaboration features
- [ ] Mobile app development
- [ ] Advanced accessibility features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- CELPIP test format and structure inspiration
- React and Tailwind CSS communities
- Open source contributors and maintainers

---

**Note**: This is a practice platform designed to help users prepare for the CELPIP test. It is not affiliated with or endorsed by Paragon Testing Enterprises, the official CELPIP test administrator.
