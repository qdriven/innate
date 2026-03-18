# Learn Together

An interactive educational platform for parents and children to learn together through AI-powered flashcards and visualizations.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment (optional for AI features):
```bash
cp .env.example .env
# Edit .env and add your Gemini API key
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Features

- **Interactive Topics**: Browse and learn from categorized educational content
- **AI Flashcards**: Generate flashcards using Google Gemini AI
- **Local Storage**: All data persisted locally in your browser
- **Admin Dashboard**: Manage categories, topics, and content
- **Cross-Platform**: Works on Web, Desktop (via Tauri), and Mobile

## Project Structure

```
learn-together/
├── src/                    # Source code
│   ├── app/               # Next.js app router
│   ├── components/        # React components
│   ├── lib/               # Utilities
│   ├── services/          # API services
│   ├── store/             # State management
│   └── types/             # TypeScript types
├── src-tauri/             # Tauri desktop app
├── backend/               # Python FastAPI backend
└── docs/                  # Documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run tauri:dev` - Start Tauri development
- `npm run tauri:build` - Build desktop application

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State**: Zustand with persistence
- **3D Graphics**: Three.js, React Three Fiber
- **AI**: Google Gemini API
- **Desktop**: Tauri (Rust)
- **Backend**: FastAPI (Python)

## Documentation

- [Overview](./docs/overview.md) - Project overview and objectives
- [Design](./docs/design.md) - Architecture and design decisions
- [Planning](./docs/planning.md) - Development phases and timeline
- [Tasks](./docs/tasks.md) - Task tracking and progress

## License

MIT
