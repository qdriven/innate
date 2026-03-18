
import { Category } from '../types';
import { DEFAULT_CATEGORIES } from '../constants';

const STORAGE_KEY = 'study_tube_data_v1';

export const storageService = {
  saveData: (data: Category[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  loadData: (): Category[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Initialize with defaults if first time
      const initial = DEFAULT_CATEGORIES;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  deleteCategory: (id: string) => {
    const data = storageService.loadData();
    const filtered = data.filter(c => c.id !== id);
    storageService.saveData(filtered);
    return filtered;
  },

  updateCategory: (category: Category) => {
    const data = storageService.loadData();
    const index = data.findIndex(c => c.id === category.id);
    if (index > -1) {
      data[index] = category;
    } else {
      data.push(category);
    }
    storageService.saveData(data);
    return data;
  }
};
