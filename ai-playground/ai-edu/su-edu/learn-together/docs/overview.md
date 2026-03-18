# Learn Together - Project Overview

## Vision

Learn Together is an interactive educational platform designed for parents and children to explore topics together through engaging visualizations, AI-generated flashcards, and collaborative learning experiences.

## Core Objectives

1. **Interactive Learning**: Combine 3D visualizations with educational content
2. **Parent-Child Collaboration**: Design for shared learning experiences
3. **Cross-Platform Access**: Support Web, Desktop, and Mobile platforms
4. **User-Managed Content**: Allow users to update and manage education topics
5. **AI-Powered Generation**: Use AI to generate flashcards for any topic

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand (with local storage persistence)
- **3D Graphics**: Three.js + React Three Fiber
- **Markdown**: react-markdown + remark-gfm

### Desktop
- **Framework**: Tauri (Rust-based)
- **Platforms**: Windows, macOS, Linux

### Backend
- **Framework**: FastAPI (Python)
- **API**: RESTful endpoints for data management
- **AI**: Google Gemini API for flashcard generation

## Project Structure

```
learn-together/
├── src/                    # Next.js source code
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── lib/               # Utilities
│   ├── services/          # API services
│   ├── store/             # State management
│   └── types/             # TypeScript types
├── src-tauri/             # Tauri desktop app
│   ├── src/               # Rust source
│   └── tauri.conf.json    # Tauri config
├── backend/               # Python FastAPI backend
│   ├── main.py            # API server
│   └── requirements.txt   # Python deps
└── docs/                  # Documentation
```

## Key Features

### 1. Category & Topic Management
- Browse educational categories
- View topics within categories
- Add custom topics
- Manage content through admin dashboard

### 2. Interactive Content
- Markdown/HTML content support
- Video embedding (YouTube, etc.)
- 3D visualizations (Three.js)
- Interactive diagrams

### 3. Flashcard System
- AI-generated flashcards
- Spaced repetition
- Progress tracking
- Local storage persistence

### 4. Cross-Platform Support
- Web application (responsive)
- Desktop app (Tauri)
- Mobile-friendly design

## Data Persistence

All data is stored locally using:
- **Browser**: localStorage (via Zustand persist)
- **Desktop**: File system (via Tauri fs API)
- **Export/Import**: JSON backup files

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+ (for backend)
- Rust (for Tauri)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start backend (optional)
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### Desktop App

```bash
# Development
npm run tauri:dev

# Build
npm run tauri:build
```
