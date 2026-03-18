# Learn Together - Design Document

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Sidebar   │  │ TopicViewer │  │  FlashcardView      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Zustand Store (with persistence)           ││
│  │  - Categories  - Topics  - Flashcards  - Progress       ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (optional)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  - Data sync  - AI integration  - File management            │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Gemini API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI Services (Gemini)                      │
│  - Flashcard generation  - Content creation                  │
└─────────────────────────────────────────────────────────────┘
```

## Component Design

### Core Components

#### 1. Sidebar
**Purpose**: Navigation and category selection
**Features**:
- Category list with icons
- Topic preview
- Admin access button
- Responsive collapse

#### 2. TopicList
**Purpose**: Display topics within selected category
**Features**:
- Topic cards with metadata
- Add new topic functionality
- Topic selection for viewing

#### 3. TopicViewer
**Purpose**: Display topic content
**Features**:
- Markdown rendering
- Video embedding
- 3D visualization canvas
- Content sections
- Breadcrumb navigation

#### 4. FlashcardView
**Purpose**: Study flashcards interactively
**Features**:
- Card flip animation
- Navigation controls
- Progress indicator
- Shuffle mode
- Study statistics

#### 5. AdminDashboard
**Purpose**: Content management interface
**Features**:
- Category CRUD operations
- Topic management
- AI flashcard generation
- Data backup/restore
- Reset functionality

## State Management

### Store Structure

```typescript
interface AppStore {
  // Data
  categories: Category[];
  selectedTopic: Topic | null;
  selectedCategory: Category | null;
  learningProgress: Record<string, Progress>;
  
  // UI State
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addCategory: (data: Partial<Category>) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  addTopic: (categoryId: string, data: Partial<Topic>) => void;
  updateTopic: (id: string, data: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  
  addFlashcard: (topicId: string, card: Flashcard) => void;
  
  // Data Management
  exportData: () => AppData;
  importData: (data: AppData) => void;
  resetData: () => void;
}
```

## Data Models

### Category
```typescript
interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  topics: Topic[];
}
```

### Topic
```typescript
interface Topic {
  id: string;
  name: string;
  icon: string;
  description: string;
  videoUrl?: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  contents: TopicContent[];
  flashcards: Flashcard[];
  createdAt: string;
  updatedAt: string;
  version: number;
}
```

### Flashcard
```typescript
interface Flashcard {
  id: string;
  question: string;
  answer: string;
}
```

## UI/UX Design

### Color Scheme
- Primary: Teal (#0d9488)
- Secondary: Slate (#64748b)
- Accent: Sky (#0ea5e9)
- Background: White/Slate-900 (light/dark mode)

### Typography
- Font: Inter (Google Fonts)
- Headings: Bold
- Body: Regular
- Code: Monospace

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Accessibility
- ARIA labels
- Keyboard navigation
- High contrast mode
- Screen reader support

## 3D Visualization Design

### Scene Setup
- Camera: PerspectiveCamera with OrbitControls
- Lighting: Ambient + Directional
- Responsive canvas sizing

### Interactive Elements
- Mouse/touch rotation
- Zoom controls
- Click interactions
- Animation controls

## Security Considerations

### Data Storage
- Local storage only (no sensitive data)
- Optional encrypted backups
- No server-side storage by default

### API Security
- CORS configuration
- Input validation
- Rate limiting (backend)

### Content Security
- Sanitized HTML input
- CSP headers
- XSS prevention

## Performance Optimization

### Frontend
- Code splitting by route
- Lazy loading components
- Image optimization
- Virtual scrolling for lists

### State Management
- Selective subscriptions
- Memoized selectors
- Batched updates

### 3D Graphics
- Level of detail (LOD)
- Instanced rendering
- Texture compression
- Frame rate limiting
