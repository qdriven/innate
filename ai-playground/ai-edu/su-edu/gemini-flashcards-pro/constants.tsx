
import { Category } from './types';

// Add missing cards property to satisfy the Category interface requirements
export const DEFAULT_CATEGORIES: Category[] = [
  { 
    id: 'react', 
    name: 'React 19 Hooks', 
    icon: '⚛️', 
    description: 'Latest features and use hook.',
    videoUrl: 'https://www.youtube.com/watch?v=8pDquaS3K7Y',
    cards: []
  },
  { 
    id: 'typescript', 
    name: 'TypeScript Guide', 
    icon: '📘', 
    description: 'Deep dive into types.',
    videoUrl: 'https://www.bilibili.com/video/BV1uY411p7E4',
    cards: []
  },
  { 
    id: 'clean-code', 
    name: 'Clean Code Principles', 
    icon: '🧹', 
    description: 'Writing maintainable JS.',
    videoUrl: 'https://www.youtube.com/watch?v=UjhX2anPhw8',
    cards: []
  },
  { 
    id: 'algorithm', 
    name: 'Sorting Visualized', 
    icon: '🔢', 
    description: 'Visual data structures.',
    videoUrl: 'https://www.bilibili.com/video/BV1nS4y1k7S6',
    cards: []
  }
];
