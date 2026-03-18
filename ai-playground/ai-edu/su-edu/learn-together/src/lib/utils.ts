import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function extractVideoInfo(url: string): { type: 'youtube' | 'bilibili' | null; idOrUrl: string | null } {
  if (!url) return { type: null, idOrUrl: null };
  
  const youtubeMatch = url.match(/(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return { type: 'youtube', idOrUrl: youtubeMatch[1] };
  }
  
  const bilibiliMatch = url.match(/(?:bilibili\.com\/video\/|bilibili\.com\/.*bvid=)(BV[a-zA-Z0-9]+)/);
  if (bilibiliMatch) {
    return { type: 'bilibili', idOrUrl: bilibiliMatch[1] };
  }
  
  return { type: null, idOrUrl: null };
}

export function detectSubjectTheme(topicName: string): string {
  const keywords: Record<string, string[]> = {
    physics: ['physics', 'motion', 'force', 'energy', 'wave', 'electromagnetic', 'quantum', '力学', '物理', '运动', '能量', '波动'],
    chemistry: ['chemistry', 'atom', 'molecule', 'reaction', 'element', '化学', '原子', '分子', '反应', '元素'],
    biology: ['biology', 'cell', 'dna', 'evolution', 'organism', '生物', '细胞', '基因', '进化'],
    math: ['math', 'algebra', 'geometry', 'calculus', 'function', '数学', '代数', '几何', '微积分', '函数'],
    astronomy: ['astronomy', 'star', 'planet', 'galaxy', 'universe', '天文', '星球', '宇宙', '星系'],
    programming: ['programming', 'code', 'algorithm', 'data structure', '编程', '代码', '算法', '数据结构'],
  };

  const lowerName = topicName.toLowerCase();
  
  for (const [subject, words] of Object.entries(keywords)) {
    if (words.some(word => lowerName.includes(word))) {
      return subject;
    }
  }
  
  return 'default';
}
