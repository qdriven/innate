export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface TopicContent {
  id: string;
  title: string;
  type: 'markdown' | 'html' | 'interactive';
  content: string;
  order: number;
}

export interface Topic {
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

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  topics: Topic[];
}

export interface LearningProgress {
  topicId: string;
  completedFlashcards: number;
  totalFlashcards: number;
  lastAccessedAt: string;
  completedContents: string[];
  quizResults: QuizResult[];
}

export interface QuizResult {
  id: string;
  score: number;
  total: number;
  completedAt: string;
}

export interface AppState {
  categories: Category[];
  selectedTopic: Topic | null;
  selectedCategory: Category | null;
  learningProgress: Record<string, LearningProgress>;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface VisualizationConfig {
  type: '3d' | 'svg' | 'mixed';
  theme: 'physics' | 'chemistry' | 'biology' | 'math' | 'astronomy' | 'programming' | 'default';
  showControls: boolean;
  autoPlay: boolean;
}

export interface InteractiveLesson {
  id: string;
  title: string;
  titleEn: string;
  subject: 'physics' | 'chemistry' | 'biology' | 'math' | 'astronomy';
  htmlPath: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  lastAccessedAt: string;
  timeSpent: number;
  score?: number;
}

export interface OverallProgress {
  totalLessons: number;
  completedLessons: number;
  totalTimeSpent: number;
  subjectProgress: Record<string, { total: number; completed: number }>;
}
