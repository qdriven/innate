# Susu Backend API

This is the backend service for the Susu interactive learning platform.

## Features

- Topic management (CRUD operations)
- AI-powered content generation (flashcards, quizzes)
- Import/Export functionality
- Update checking and manifest

## Running

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py

# Or using uvicorn
uvicorn main:app --reload --port 8000
```

## API Endpoints

### Topics

- `GET /topics` - Get all topics
- `GET /topics/{id}` - Get a specific topic
- `POST /topics` - Create a new topic
- `PUT /topics/{id}` - Update a topic
- `DELETE /topics/{id}` - Delete a topic
- `POST /topics/{id}/flashcards` - Add a flashcard to a topic

### Generation

- `POST /generate/flashcards` - Generate flashcards using AI
- `POST /generate/quiz` - Generate quiz questions using AI

### Updates

- `GET /updates/manifest` - Get update manifest
- `GET /updates/check` - Check for updates

### Import/Export

- `POST /import` - Import topics
- `GET /export` - Export all topics

## Configuration

Set the following environment variables:

- `GEMINI_API_KEY` - Google Gemini API key for AI generation (optional)