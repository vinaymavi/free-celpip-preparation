# Backend Integration Plan

## Overview

This document outlines the plan for integrating a backend API to support the CELPIP preparation frontend application.

## API Endpoints

### Content Generation Endpoints

#### 1. Reading Passage Generation

```
POST /api/generate/reading
Content-Type: application/json

Request Body:
{
  "topic": "optional topic for passage",
  "difficulty": "beginner|intermediate|advanced",
  "length": "short|medium|long"
}

Response:
{
  "success": true,
  "data": {
    "id": "passage_123",
    "title": "The Benefits of Urban Gardening",
    "content": "Urban gardening has become...",
    "wordCount": 587,
    "difficulty": "intermediate",
    "questions": [
      {
        "id": 1,
        "question": "What is the main benefit mentioned?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": 1,
        "explanation": "The passage clearly states..."
      }
    ]
  }
}
```

#### 2. Writing Prompt Generation

```
POST /api/generate/writing
Content-Type: application/json

Request Body:
{
  "type": "email|essay",
  "difficulty": "beginner|intermediate|advanced",
  "topic": "optional topic preference"
}

Response:
{
  "success": true,
  "data": {
    "id": "prompt_456",
    "type": "email",
    "title": "Complaint to Hotel Manager",
    "prompt": "You recently stayed at...",
    "requirements": [
      "Use appropriate email format",
      "Write 150-200 words"
    ],
    "timeLimit": 27,
    "scoringCriteria": {
      "content": "Address all points mentioned",
      "language": "Use appropriate vocabulary",
      "organization": "Logical structure"
    }
  }
}
```

#### 3. Speaking Task Generation

```
POST /api/generate/speaking
Content-Type: application/json

Request Body:
{
  "type": "personal_experience|describing_scene|prediction|opinion",
  "difficulty": "beginner|intermediate|advanced"
}

Response:
{
  "success": true,
  "data": {
    "id": "speaking_789",
    "type": "personal_experience",
    "title": "Talk about a memorable event",
    "prompt": "Tell me about a time when...",
    "preparationTime": 30,
    "responseTime": 60,
    "scoringCriteria": {
      "fluency": "Natural flow and pace",
      "vocabulary": "Appropriate word choice",
      "grammar": "Correct sentence structure",
      "pronunciation": "Clear articulation"
    }
  }
}
```

#### 4. Listening Content Generation

```
POST /api/generate/listening
Content-Type: application/json

Request Body:
{
  "type": "conversation|news|information",
  "difficulty": "beginner|intermediate|advanced",
  "duration": "short|medium|long"
}

Response:
{
  "success": true,
  "data": {
    "id": "listening_101",
    "type": "conversation",
    "title": "Weekend Plans Discussion",
    "audioUrl": "https://api.example.com/audio/listening_101.mp3",
    "transcript": "Sarah: Hi Mike! Do you have...",
    "duration": 180,
    "questions": [
      {
        "id": 1,
        "question": "What does Sarah want to do?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": 1
      }
    ]
  }
}
```

### Evaluation Endpoints

#### 1. Submit Writing Response

```
POST /api/evaluate/writing
Content-Type: application/json

Request Body:
{
  "promptId": "prompt_456",
  "response": "Dear Hotel Manager, I am writing to...",
  "timeSpent": 1425,
  "wordCount": 187
}

Response:
{
  "success": true,
  "data": {
    "overall": {
      "score": 8.5,
      "grade": "B+",
      "level": "intermediate"
    },
    "breakdown": {
      "content": {
        "score": 9,
        "feedback": "All required points addressed effectively"
      },
      "language": {
        "score": 8,
        "feedback": "Good vocabulary with minor errors"
      },
      "organization": {
        "score": 8.5,
        "feedback": "Clear structure with appropriate transitions"
      }
    },
    "suggestions": [
      "Consider using more varied sentence structures",
      "Watch for minor spelling errors"
    ]
  }
}
```

#### 2. Submit Speaking Response

```
POST /api/evaluate/speaking
Content-Type: multipart/form-data

Form Data:
- taskId: speaking_789
- audio: (audio file)
- preparationTime: 30
- responseTime: 58

Response:
{
  "success": true,
  "data": {
    "overall": {
      "score": 7.5,
      "grade": "B",
      "level": "intermediate"
    },
    "breakdown": {
      "fluency": {
        "score": 8,
        "feedback": "Good pace with natural pauses"
      },
      "vocabulary": {
        "score": 7,
        "feedback": "Appropriate word choice, could be more varied"
      },
      "grammar": {
        "score": 7.5,
        "feedback": "Mostly correct with minor errors"
      },
      "pronunciation": {
        "score": 8,
        "feedback": "Clear and understandable"
      }
    },
    "transcript": "I remember a time when I helped...",
    "suggestions": [
      "Try to use more descriptive adjectives",
      "Work on past tense consistency"
    ]
  }
}
```

### User Management Endpoints

#### 1. User Registration

```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### 2. User Login

```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token_here"
  }
}
```

### Progress Tracking Endpoints

#### 1. Get User Progress

```
GET /api/progress
Authorization: Bearer jwt_token_here

Response:
{
  "success": true,
  "data": {
    "overall": {
      "level": "intermediate",
      "totalSessions": 45,
      "totalTimeSpent": 12600,
      "averageScore": 7.8
    },
    "sections": {
      "reading": {
        "sessionsCompleted": 12,
        "averageScore": 8.2,
        "lastScore": 8.5,
        "improvementTrend": "increasing"
      },
      "writing": {
        "sessionsCompleted": 10,
        "averageScore": 7.1,
        "lastScore": 7.8,
        "improvementTrend": "increasing"
      },
      "speaking": {
        "sessionsCompleted": 8,
        "averageScore": 7.5,
        "lastScore": 7.9,
        "improvementTrend": "stable"
      },
      "listening": {
        "sessionsCompleted": 15,
        "averageScore": 8.5,
        "lastScore": 8.7,
        "improvementTrend": "increasing"
      }
    }
  }
}
```

#### 2. Save Session Result

```
POST /api/progress/session
Authorization: Bearer jwt_token_here
Content-Type: application/json

Request Body:
{
  "section": "reading",
  "contentId": "passage_123",
  "score": 8.5,
  "timeSpent": 420,
  "responses": [
    {
      "questionId": 1,
      "selectedAnswer": 1,
      "correct": true
    }
  ]
}

Response:
{
  "success": true,
  "data": {
    "sessionId": "session_456",
    "newAverageScore": 8.2,
    "improvement": "+0.3",
    "streakCount": 5
  }
}
```

## Technology Stack

### Backend Framework Options

1. **Node.js with Express** - JavaScript consistency
2. **Python with FastAPI** - Great for AI integration
3. **Go with Gin** - High performance
4. **Rust with Actix** - Maximum performance

### AI Integration Options

1. **OpenAI GPT-4** - High quality content generation
2. **Anthropic Claude** - Good reasoning capabilities
3. **Cohere** - Language understanding and generation
4. **Local Models** - Llama 2, Code Llama for privacy

### Database Options

1. **PostgreSQL** - Relational data with JSON support
2. **MongoDB** - Document-based for flexible schemas
3. **Redis** - Caching and session storage

### Audio Processing

1. **Web Speech API** - Browser-based speech recognition
2. **Google Speech-to-Text** - Cloud-based STT
3. **OpenAI Whisper** - Local or cloud STT
4. **AssemblyAI** - Specialized speech processing

## Implementation Phases

### Phase 1: Basic API Setup

- [ ] Set up backend framework
- [ ] Implement basic CRUD endpoints
- [ ] Add authentication system
- [ ] Deploy to cloud platform

### Phase 2: AI Integration

- [ ] Integrate content generation APIs
- [ ] Implement content evaluation
- [ ] Add caching for generated content
- [ ] Optimize API response times

### Phase 3: Advanced Features

- [ ] Audio processing for speaking/listening
- [ ] Real-time progress tracking
- [ ] Advanced analytics
- [ ] Mobile API optimizations

### Phase 4: Scale and Optimize

- [ ] Load balancing
- [ ] Database optimization
- [ ] CDN for audio content
- [ ] Rate limiting and security

## Security Considerations

### Authentication & Authorization

- JWT tokens with refresh mechanism
- Role-based access control
- Password hashing with bcrypt
- Rate limiting on auth endpoints

### Data Protection

- HTTPS enforcement
- Input validation and sanitization
- SQL injection prevention
- CORS configuration

### Privacy

- User data encryption
- GDPR compliance
- Data retention policies
- Audit logging

## Monitoring and Analytics

### Application Monitoring

- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Uptime monitoring (Pingdom)
- Log aggregation (ELK stack)

### User Analytics

- Usage patterns tracking
- Feature adoption metrics
- Performance bottlenecks
- User feedback collection

## Deployment Strategy

### Development Environment

- Docker for local development
- Environment-specific configs
- Database migrations
- Automated testing

### Production Deployment

- CI/CD pipeline
- Blue-green deployment
- Health checks
- Automatic scaling

### Infrastructure

- Cloud provider (AWS/GCP/Azure)
- Container orchestration (Kubernetes)
- Database hosting (managed services)
- CDN for static assets
