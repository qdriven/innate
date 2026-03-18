import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category, Topic, LearningProgress, Flashcard, LessonProgress, OverallProgress } from '@/types';
import { generateId } from '@/lib/utils';
import { interactiveLessons } from '@/lib/lessons';

interface AppStore {
  categories: Category[];
  selectedTopic: Topic | null;
  selectedCategory: Category | null;
  learningProgress: Record<string, LearningProgress>;
  lessonProgress: Record<string, LessonProgress>;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  
  setSelectedTopic: (topic: Topic | null) => void;
  setSelectedCategory: (category: Category | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  addCategory: (category: Omit<Category, 'id' | 'topics'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  
  addTopic: (categoryId: string, topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  updateTopic: (topic: Topic) => void;
  deleteTopic: (topicId: string) => void;
  
  addFlashcard: (topicId: string, flashcard: Omit<Flashcard, 'id'>) => void;
  updateFlashcard: (topicId: string, flashcard: Flashcard) => void;
  deleteFlashcard: (topicId: string, flashcardId: string) => void;
  
  updateLearningProgress: (topicId: string, progress: Partial<LearningProgress>) => void;
  markContentCompleted: (topicId: string, contentId: string) => void;
  
  updateLessonProgress: (lessonId: string, progress: Partial<LessonProgress>) => void;
  markLessonCompleted: (lessonId: string, score?: number) => void;
  getOverallProgress: () => OverallProgress;
  
  importData: (data: { categories: Category[]; learningProgress: Record<string, LearningProgress> }) => void;
  exportData: () => { categories: Category[]; learningProgress: Record<string, LearningProgress> };
  resetData: () => void;
}

const defaultCategories: Category[] = [
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    description: 'Explore the wonders of science',
    topics: [],
  },
  {
    id: 'math',
    name: 'Mathematics',
    icon: '📐',
    description: 'Discover the beauty of mathematics',
    topics: [],
  },
  {
    id: 'language',
    name: 'Language',
    icon: '📚',
    description: 'Learn new languages and literature',
    topics: [],
  },
  {
    id: 'history',
    name: 'History',
    icon: '🏛️',
    description: 'Journey through time and history',
    topics: [],
  },
  {
    id: 'art',
    name: 'Art & Music',
    icon: '🎨',
    description: 'Express creativity through art and music',
    topics: [],
  },
];

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      categories: defaultCategories,
      selectedTopic: null,
      selectedCategory: null,
      learningProgress: {},
      lessonProgress: {},
      isAdmin: false,
      isLoading: false,
      error: null,

      setSelectedTopic: (topic) => set({ selectedTopic: topic }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      addCategory: (category) => set((state) => ({
        categories: [...state.categories, { ...category, id: generateId(), topics: [] }],
      })),

      updateCategory: (category) => set((state) => ({
        categories: state.categories.map((c) => (c.id === category.id ? category : c)),
      })),

      deleteCategory: (categoryId) => set((state) => ({
        categories: state.categories.filter((c) => c.id !== categoryId),
        selectedCategory: state.selectedCategory?.id === categoryId ? null : state.selectedCategory,
      })),

      addTopic: (categoryId, topic) => set((state) => ({
        categories: state.categories.map((c) => {
          if (c.id !== categoryId) return c;
          const now = new Date().toISOString();
          const newTopic: Topic = {
            ...topic,
            id: generateId(),
            createdAt: now,
            updatedAt: now,
            version: 1,
          };
          return { ...c, topics: [...c.topics, newTopic] };
        }),
      })),

      updateTopic: (topic) => set((state) => ({
        categories: state.categories.map((c) => ({
          ...c,
          topics: c.topics.map((t) =>
            t.id === topic.id
              ? { ...topic, updatedAt: new Date().toISOString(), version: t.version + 1 }
              : t
          ),
        })),
        selectedTopic: state.selectedTopic?.id === topic.id ? topic : state.selectedTopic,
      })),

      deleteTopic: (topicId) => set((state) => ({
        categories: state.categories.map((c) => ({
          ...c,
          topics: c.topics.filter((t) => t.id !== topicId),
        })),
        selectedTopic: state.selectedTopic?.id === topicId ? null : state.selectedTopic,
      })),

      addFlashcard: (topicId, flashcard) => set((state) => ({
        categories: state.categories.map((c) => ({
          ...c,
          topics: c.topics.map((t) =>
            t.id === topicId
              ? { ...t, flashcards: [...t.flashcards, { ...flashcard, id: generateId() }] }
              : t
          ),
        })),
      })),

      updateFlashcard: (topicId, flashcard) => set((state) => ({
        categories: state.categories.map((c) => ({
          ...c,
          topics: c.topics.map((t) =>
            t.id === topicId
              ? {
                  ...t,
                  flashcards: t.flashcards.map((f) =>
                    f.id === flashcard.id ? flashcard : f
                  ),
                }
              : t
          ),
        })),
      })),

      deleteFlashcard: (topicId, flashcardId) => set((state) => ({
        categories: state.categories.map((c) => ({
          ...c,
          topics: c.topics.map((t) =>
            t.id === topicId
              ? { ...t, flashcards: t.flashcards.filter((f) => f.id !== flashcardId) }
              : t
          ),
        })),
      })),

      updateLearningProgress: (topicId, progress) => set((state) => ({
        learningProgress: {
          ...state.learningProgress,
          [topicId]: {
            ...state.learningProgress[topicId],
            ...progress,
            topicId,
            lastAccessedAt: new Date().toISOString(),
          } as LearningProgress,
        },
      })),

      markContentCompleted: (topicId, contentId) => set((state) => {
        const currentProgress = state.learningProgress[topicId] || {
          topicId,
          completedFlashcards: 0,
          totalFlashcards: 0,
          lastAccessedAt: new Date().toISOString(),
          completedContents: [],
          quizResults: [],
        };
        
        if (currentProgress.completedContents.includes(contentId)) {
          return state;
        }
        
        return {
          learningProgress: {
            ...state.learningProgress,
            [topicId]: {
              ...currentProgress,
              completedContents: [...currentProgress.completedContents, contentId],
            },
          },
        };
      }),

      updateLessonProgress: (lessonId, progress) => set((state) => ({
        lessonProgress: {
          ...state.lessonProgress,
          [lessonId]: {
            ...state.lessonProgress[lessonId],
            ...progress,
            lessonId,
            lastAccessedAt: new Date().toISOString(),
          } as LessonProgress,
        },
      })),

      markLessonCompleted: (lessonId, score) => set((state) => {
        const currentProgress = state.lessonProgress[lessonId] || {
          lessonId,
          completed: false,
          lastAccessedAt: new Date().toISOString(),
          timeSpent: 0,
        };
        
        return {
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: {
              ...currentProgress,
              completed: true,
              score,
              lastAccessedAt: new Date().toISOString(),
            },
          },
        };
      }),

      getOverallProgress: () => {
        const { lessonProgress } = get();
        const totalLessons = interactiveLessons.length;
        const completedLessons = Object.values(lessonProgress).filter(p => p.completed).length;
        const totalTimeSpent = Object.values(lessonProgress).reduce((sum, p) => sum + (p.timeSpent || 0), 0);
        
        const subjectProgress: Record<string, { total: number; completed: number }> = {};
        const subjects = ['physics', 'chemistry', 'biology', 'math', 'astronomy'];
        
        for (const subject of subjects) {
          const subjectLessons = interactiveLessons.filter(l => l.subject === subject);
          subjectProgress[subject] = {
            total: subjectLessons.length,
            completed: subjectLessons.filter(l => lessonProgress[l.id]?.completed).length,
          };
        }
        
        return { totalLessons, completedLessons, totalTimeSpent, subjectProgress };
      },

      importData: (data) => set({
        categories: data.categories,
        learningProgress: data.learningProgress,
      }),

      exportData: () => ({
        categories: get().categories,
        learningProgress: get().learningProgress,
      }),

      resetData: () => set({
        categories: defaultCategories,
        learningProgress: {},
        lessonProgress: {},
        selectedTopic: null,
        selectedCategory: null,
      }),
    }),
    {
      name: 'learn-together-storage',
    }
  )
);
