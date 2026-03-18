/**
 * Storage Service for local data persistence
 * Uses localStorage for browser storage
 */

import { Topic, UserProgress, AppSettings, TopicCategory } from '@/types';

const STORAGE_KEY = 'susu_data_v1';

interface StorageData {
  topics: Topic[];
  categories: TopicCategory[];
  userProgress: UserProgress[];
  settings: AppSettings;
  version: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'zh',
  autoUpdate: false,
};

const DEFAULT_DATA: StorageData = {
  topics: [],
  categories: [],
  userProgress: [],
  settings: DEFAULT_SETTINGS,
  version: 1,
};

class StorageService {
  private storageKey: string;

  constructor(storageKey: string = STORAGE_KEY) {
    this.storageKey = storageKey;
  }

  // Check if running in browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Load all data
  loadData(): StorageData {
    if (!this.isBrowser()) return DEFAULT_DATA;

    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) {
        this.saveData(DEFAULT_DATA);
        return DEFAULT_DATA;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading data from storage:', error);
      return DEFAULT_DATA;
    }
  }

  // Save all data
  saveData(data: StorageData): void {
    if (!this.isBrowser()) return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data to storage:', error);
    }
  }

  // Topics
  getTopics(): Topic[] {
    return this.loadData().topics;
  }

  getTopic(id: string): Topic | undefined {
    return this.getTopics().find(t => t.id === id);
  }

  saveTopic(topic: Topic): void {
    const data = this.loadData();
    const index = data.topics.findIndex(t => t.id === topic.id);

    if (index >= 0) {
      data.topics[index] = { ...topic, updatedAt: new Date().toISOString(), version: topic.version + 1 };
    } else {
      data.topics.push(topic);
    }

    this.saveData(data);
  }

  deleteTopic(id: string): void {
    const data = this.loadData();
    data.topics = data.topics.filter(t => t.id !== id);
    this.saveData(data);
  }

  // Categories
  getCategories(): TopicCategory[] {
    return this.loadData().categories;
  }

  saveCategory(category: TopicCategory): void {
    const data = this.loadData();
    const index = data.categories.findIndex(c => c.id === category.id);

    if (index >= 0) {
      data.categories[index] = category;
    } else {
      data.categories.push(category);
    }

    this.saveData(data);
  }

  deleteCategory(id: string): void {
    const data = this.loadData();
    data.categories = data.categories.filter(c => c.id !== id);
    this.saveData(data);
  }

  // User Progress
  getUserProgress(): UserProgress[] {
    return this.loadData().userProgress;
  }

  getTopicProgress(topicId: string): UserProgress | undefined {
    return this.getUserProgress().find(p => p.topicId === topicId);
  }

  saveUserProgress(progress: UserProgress): void {
    const data = this.loadData();
    const index = data.userProgress.findIndex(p => p.topicId === progress.topicId);

    if (index >= 0) {
      data.userProgress[index] = progress;
    } else {
      data.userProgress.push(progress);
    }

    this.saveData(data);
  }

  // Settings
  getSettings(): AppSettings {
    return this.loadData().settings;
  }

  saveSettings(settings: Partial<AppSettings>): void {
    const data = this.loadData();
    data.settings = { ...data.settings, ...settings };
    this.saveData(data);
  }

  // Import/Export
  importTopics(topics: Topic[]): { added: number; updated: number } {
    const data = this.loadData();
    const existingIds = new Set(data.topics.map(t => t.id));
    let added = 0;
    let updated = 0;

    topics.forEach(topic => {
      if (existingIds.has(topic.id)) {
        const index = data.topics.findIndex(t => t.id === topic.id);
        if (topic.version > data.topics[index].version) {
          data.topics[index] = topic;
          updated++;
        }
      } else {
        data.topics.push(topic);
        added++;
      }
    });

    this.saveData(data);
    return { added, updated };
  }

  exportTopics(): Topic[] {
    return this.getTopics();
  }

  exportAllData(): StorageData {
    return this.loadData();
  }

  // Clear all data
  clearAllData(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.storageKey);
    }
  }

  // Get storage size (approximate)
  getStorageSize(): number {
    if (!this.isBrowser()) return 0;

    const data = localStorage.getItem(this.storageKey);
    return data ? new Blob([data]).size : 0;
  }
}

export const storageService = new StorageService();
export default storageService;