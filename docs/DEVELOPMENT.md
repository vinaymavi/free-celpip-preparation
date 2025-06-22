# Development Guide

## Project Architecture

This CELPIP preparation application is built with modern web technologies to provide an interactive and engaging learning experience.

### Frontend Architecture

```
src/
├── components/          # React components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── Dashboard.tsx   # Landing page with section overview
│   ├── ReadingSection.tsx    # Reading comprehension practice
│   ├── WritingSection.tsx    # Writing tasks (email & essay)
│   ├── SpeakingSection.tsx   # Speaking practice simulation
│   └── ListeningSection.tsx  # Listening comprehension
├── utils/              # Utility functions
│   ├── api.ts         # API communication functions
│   └── helpers.ts     # Common helper functions
├── App.tsx            # Main application component
├── main.tsx          # Application entry point
└── index.css         # Global styles with Tailwind
```

## Component Structure

### Layout Component

- Responsive navigation with mobile support
- Uses Headless UI Disclosure for mobile menu
- Consistent header across all pages
- Handles section switching

### Section Components

Each section (Reading, Writing, Speaking, Listening) follows a similar pattern:

1. **State Management**: Local state for current content, user responses, timers
2. **Content Generation**: Simulated AI content generation with loading states
3. **User Interaction**: Forms, timers, and interactive elements
4. **Results Display**: Scoring, feedback, and progress tracking

## Styling System

### Tailwind CSS Configuration

- Custom color palette (primary, secondary)
- Extended font family (Inter)
- Custom component classes in `@layer components`

### Component Classes

```css
.btn
  #
  Base
  button
  styles
  .btn-primary
  #
  Primary
  button
  variant
  .btn-secondary
  #
  Secondary
  button
  variant
  .btn-outline
  #
  Outline
  button
  variant
  .card
  #
  Card
  container
  .input
  #
  Form
  input
  styles
  .textarea
  #
  Textarea
  styles;
```

## State Management

Currently using React's built-in state management:

- `useState` for component-level state
- Props for data passing between components
- No external state management library (Redux, Zustand) yet

### Future Considerations

For scaling, consider adding:

- Context API for global state
- React Query for server state
- Zustand for client state

## API Integration

### Current Implementation

- Simulated API calls with setTimeout
- Mock data for all content types
- No real backend integration yet

### Future Backend Integration

The `utils/api.ts` file is structured to easily integrate with a real backend:

```typescript
// Ready for real API integration
export async function generateReadingPassage(topic?: string) {
  return apiRequest("/generate/reading", {
    method: "POST",
    body: JSON.stringify({ topic }),
  });
}
```

## Performance Considerations

### Implemented Optimizations

- Lazy loading ready (components can be code-split)
- Tailwind CSS purging for smaller bundle size
- Vite for fast development and optimized builds

### Future Optimizations

- React.memo for expensive components
- useMemo for expensive calculations
- Virtual scrolling for large lists
- Service worker for offline capability

## Testing Strategy

### Current State

- No tests implemented yet
- TypeScript provides compile-time safety

### Recommended Testing Approach

1. **Unit Tests**: Component testing with React Testing Library
2. **Integration Tests**: User workflow testing
3. **E2E Tests**: Full application testing with Playwright
4. **Accessibility Tests**: Automated a11y testing

## Accessibility (a11y)

### Implemented Features

- Semantic HTML structure
- Proper heading hierarchy
- Focus management with Headless UI
- Color contrast compliance
- Screen reader support

### Areas for Improvement

- Skip navigation links
- Live regions for dynamic content
- Keyboard shortcuts
- High contrast mode

## Browser Support

### Target Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills Needed

- None currently (modern ES6+ features used)
- May need audio API polyfills for listening section

## Build and Deployment

### Development

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Production Deployment Options

1. **Static Hosting**: Netlify, Vercel, GitHub Pages
2. **CDN**: AWS CloudFront, Cloudflare
3. **Traditional Hosting**: Any web server (Apache, Nginx)

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

- API endpoints
- Feature flags
- Analytics keys

## Security Considerations

### Current Implementation

- No authentication system
- Client-side only application
- No sensitive data storage

### Future Security Measures

- Input sanitization for user content
- HTTPS enforcement
- Content Security Policy (CSP)
- Rate limiting for API calls

## Contributing Guidelines

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for code formatting
- Conventional commits for git messages

### Component Guidelines

1. Use functional components with hooks
2. Include TypeScript interfaces for props
3. Follow single responsibility principle
4. Include proper error boundaries

### File Organization

- One component per file
- Co-locate related files
- Use index files for clean imports
- Separate utility functions

## Roadmap

### Phase 1 (Current)

- ✅ Basic UI and navigation
- ✅ Mock content for all sections
- ✅ Responsive design
- ✅ Timer functionality

### Phase 2 (Next)

- [ ] Real AI integration
- [ ] User authentication
- [ ] Progress tracking
- [ ] Audio recording/playback

### Phase 3 (Future)

- [ ] Advanced analytics
- [ ] Collaborative features
- [ ] Mobile app
- [ ] Offline mode

## Troubleshooting

### Common Issues

1. **Node.js Version Conflicts**

   - Use Node.js 18+ for best compatibility
   - Consider using nvm for version management

2. **Tailwind Styles Not Loading**

   - Check PostCSS configuration
   - Verify Tailwind directives in CSS file

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript configurations

### Development Tips

- Use React Developer Tools browser extension
- Enable React strict mode for debugging
- Use console.log sparingly (prefer debugger)
- Test in multiple browsers during development
