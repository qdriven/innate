/**
 * Update Service for checking and applying updates
 */

import { UpdateManifest, Topic } from '@/types';
import apiService from './api';
import storageService from './storage';

interface UpdateCheckResult {
  hasUpdate: boolean;
  latestVersion?: string;
  changes?: string[];
  error?: string;
}

interface UpdateApplyResult {
  success: boolean;
  addedTopics: number;
  updatedTopics: number;
  error?: string;
}

class UpdateService {
  private currentVersion: string = '0.1.0';

  getCurrentVersion(): string {
    return this.currentVersion;
  }

  async checkForUpdates(): Promise<UpdateCheckResult> {
    try {
      const response = await apiService.checkUpdates(this.currentVersion);

      if (response.error) {
        return { hasUpdate: false, error: response.error };
      }

      return {
        hasUpdate: response.data?.hasUpdate || false,
        latestVersion: response.data?.latestVersion,
        changes: response.data?.changes,
      };
    } catch (error) {
      return { hasUpdate: false, error: (error as Error).message };
    }
  }

  async getUpdateManifest(): Promise<UpdateManifest | null> {
    try {
      const response = await apiService.getUpdateManifest();
      return response.data || null;
    } catch (error) {
      console.error('Error getting update manifest:', error);
      return null;
    }
  }

  async applyUpdate(manifest: UpdateManifest): Promise<UpdateApplyResult> {
    try {
      let addedTopics = 0;
      let updatedTopics = 0;

      // Process topic updates
      for (const topicUpdate of manifest.topics) {
        switch (topicUpdate.action) {
          case 'add':
            if (topicUpdate.data) {
              storageService.saveTopic(topicUpdate.data as Topic);
              addedTopics++;
            }
            break;
          case 'update':
            if (topicUpdate.data) {
              storageService.saveTopic(topicUpdate.data as Topic);
              updatedTopics++;
            }
            break;
          case 'delete':
            if (topicUpdate.id) {
              storageService.deleteTopic(topicUpdate.id);
            }
            break;
        }
      }

      // Update version
      this.currentVersion = manifest.version;

      return {
        success: true,
        addedTopics,
        updatedTopics,
      };
    } catch (error) {
      return {
        success: false,
        addedTopics: 0,
        updatedTopics: 0,
        error: (error as Error).message,
      };
    }
  }

  async fetchAllTopics(): Promise<Topic[]> {
    try {
      const response = await apiService.getTopics();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching topics:', error);
      return [];
    }
  }

  async syncWithServer(): Promise<{ added: number; updated: number }> {
    const serverTopics = await this.fetchAllTopics();
    if (serverTopics.length === 0) {
      return { added: 0, updated: 0 };
    }
    return storageService.importTopics(serverTopics);
  }
}

export const updateService = new UpdateService();
export default updateService;