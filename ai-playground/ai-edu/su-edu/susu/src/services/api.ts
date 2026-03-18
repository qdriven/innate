/**
 * API Service for communicating with the backend
 */

import { Topic, UpdateManifest } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Topics
  async getTopics(): Promise<ApiResponse<Topic[]>> {
    return this.fetch<Topic[]>('/topics');
  }

  async getTopic(id: string): Promise<ApiResponse<Topic>> {
    return this.fetch<Topic>(`/topics/${id}`);
  }

  async createTopic(topic: Partial<Topic>): Promise<ApiResponse<Topic>> {
    return this.fetch<Topic>('/topics', {
      method: 'POST',
      body: JSON.stringify(topic),
    });
  }

  async updateTopic(id: string, topic: Partial<Topic>): Promise<ApiResponse<Topic>> {
    return this.fetch<Topic>(`/topics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(topic),
    });
  }

  async deleteTopic(id: string): Promise<ApiResponse<void>> {
    return this.fetch<void>(`/topics/${id}`, {
      method: 'DELETE',
    });
  }

  // Import/Export
  async importTopics(topics: Topic[]): Promise<ApiResponse<{ added: number; updated: number; total: number }>> {
    return this.fetch<{ added: number; updated: number; total: number }>('/import', {
      method: 'POST',
      body: JSON.stringify(topics),
    });
  }

  async exportTopics(): Promise<ApiResponse<Topic[]>> {
    return this.fetch<Topic[]>('/export');
  }

  // Updates
  async checkUpdates(currentVersion: string): Promise<ApiResponse<{
    hasUpdate: boolean;
    latestVersion: string;
    releaseDate: string;
    changes: string[];
  }>> {
    return this.fetch(`/updates/check?current_version=${currentVersion}`);
  }

  async getUpdateManifest(): Promise<ApiResponse<UpdateManifest>> {
    return this.fetch<UpdateManifest>('/updates/manifest');
  }

  // AI Generation
  async generateFlashcards(topicName: string, count: number = 10): Promise<ApiResponse<{ flashcards: any[] }>> {
    return this.fetch<{ flashcards: any[] }>('/generate/flashcards', {
      method: 'POST',
      body: JSON.stringify({ topic_name: topicName, count }),
    });
  }

  async generateQuiz(topicName: string, contentSummary: string, count: number = 5): Promise<ApiResponse<{ questions: any[] }>> {
    return this.fetch<{ questions: any[] }>('/generate/quiz', {
      method: 'POST',
      body: JSON.stringify({ topic_name: topicName, content_summary: contentSummary, count }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;