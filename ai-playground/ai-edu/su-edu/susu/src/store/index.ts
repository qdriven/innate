import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Topic, UserProgress, AppSettings, TopicCategory } from '@/types';

interface AppState {
  // Topics
  topics: Topic[];
  categories: TopicCategory[];
  selectedTopicId: string | null;

  // Progress
  userProgress: UserProgress[];

  // Settings
  settings: AppSettings;

  // UI State
  sidebarOpen: boolean;
  currentView: 'learn' | 'flashcards' | 'quiz' | 'settings';

  // Actions
  setSelectedTopic: (id: string | null) => void;
  addTopic: (topic: Topic) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;

  addCategory: (category: TopicCategory) => void;
  updateCategory: (id: string, updates: Partial<TopicCategory>) => void;
  deleteCategory: (id: string) => void;

  updateProgress: (topicId: string, progress: Partial<UserProgress>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;

  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: 'learn' | 'flashcards' | 'quiz' | 'settings') => void;

  // Import/Export
  importTopics: (topics: Topic[]) => void;
  exportTopics: () => Topic[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      topics: [],
      categories: [],
      selectedTopicId: null,
      userProgress: [],
      settings: {
        theme: 'system',
        language: 'zh',
        autoUpdate: false,
      },
      sidebarOpen: true,
      currentView: 'learn',

      setSelectedTopic: (id) => set({ selectedTopicId: id }),

      addTopic: (topic) =>
        set((state) => ({
          topics: [...state.topics, topic],
        })),

      updateTopic: (id, updates) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString(), version: t.version + 1 } : t
          ),
        })),

      deleteTopic: (id) =>
        set((state) => ({
          topics: state.topics.filter((t) => t.id !== id),
          selectedTopicId: state.selectedTopicId === id ? null : state.selectedTopicId,
        })),

      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),

      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),

      updateProgress: (topicId, progress) =>
        set((state) => {
          const existingIndex = state.userProgress.findIndex((p) => p.topicId === topicId);
          if (existingIndex >= 0) {
            const updated = [...state.userProgress];
            updated[existingIndex] = {
              ...updated[existingIndex],
              ...progress,
              lastAccessed: new Date().toISOString(),
            };
            return { userProgress: updated };
          }
          return {
            userProgress: [
              ...state.userProgress,
              {
                topicId,
                ...progress,
                lastAccessed: new Date().toISOString(),
              } as UserProgress,
            ],
          };
        }),

      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCurrentView: (view) => set({ currentView: view }),

      importTopics: (topics) =>
        set((state) => {
          const existingIds = new Set(state.topics.map((t) => t.id));
          const newTopics = topics.filter((t) => !existingIds.has(t.id));
          const updatedTopics = topics.filter((t) => existingIds.has(t.id));
          const merged = [...state.topics];
          updatedTopics.forEach((ut) => {
            const idx = merged.findIndex((t) => t.id === ut.id);
            if (idx >= 0 && ut.version > merged[idx].version) {
              merged[idx] = ut;
            }
          });
          return { topics: [...merged, ...newTopics] };
        }),

      exportTopics: () => get().topics,
    }),
    {
      name: 'susu-storage',
      version: 1,
    }
  )
);