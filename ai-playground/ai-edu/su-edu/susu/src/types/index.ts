// Core types for the Susu educational platform

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Topic {
  id: string;
  name: string;
  nameEn?: string;
  icon: string;
  description: string;
  subject: Subject;
  renderMode: RenderMode;
  content: TopicContent;
  flashcards: Flashcard[];
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export type Subject = 'physics' | 'chemistry' | 'biology' | 'math' | 'astronomy' | 'programming' | 'general';
export type RenderMode = 'three' | 'svg' | 'hybrid';

export interface TopicContent {
  learningObjectives: string[];
  formulas?: Formula[];
  principles: string[];
  realWorldApplications?: string[];
  extendedReading?: string[];
  quizQuestions?: QuizQuestion[];
  visualization?: VisualizationConfig;
  markdownContent?: string;
  htmlContent?: string;
}

export interface Formula {
  id: string;
  name: string;
  latex: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface VisualizationConfig {
  type: '3d' | '2d' | 'animation';
  parameters: Record<string, number | string | boolean>;
  controls: VisualizationControl[];
}

export interface VisualizationControl {
  id: string;
  label: string;
  type: 'slider' | 'toggle' | 'select';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | boolean | string;
  options?: { label: string; value: string }[];
}

export interface TopicCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  topicIds: string[];
}

export interface UserProgress {
  topicId: string;
  flashcardProgress: {
    cardId: string;
    attempts: number;
    correct: number;
    lastReviewed: string;
  }[];
  quizScores: {
    quizId: string;
    score: number;
    completedAt: string;
  }[];
  learningObjectivesCompleted: string[];
  lastAccessed: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'zh' | 'en';
  autoUpdate: boolean;
  updateUrl?: string;
}

export interface UpdateManifest {
  version: string;
  releaseDate: string;
  changes: string[];
  topics: {
    id: string;
    action: 'add' | 'update' | 'delete';
    data?: Partial<Topic>;
  }[];
}