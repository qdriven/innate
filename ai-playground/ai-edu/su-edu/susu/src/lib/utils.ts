import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function detectSubject(topicName: string): import('@/types').Subject {
  const keywords: Record<import('@/types').Subject, string[]> = {
    physics: ['力学', '运动', '牛顿', '电磁', '波动', '量子', '相对论', 'force', 'motion', 'newton', 'electromagnetic'],
    chemistry: ['化学', '分子', '反应', '酸碱', '氧化', '元素', 'chemistry', 'molecule', 'reaction', 'element'],
    biology: ['生物', '细胞', 'DNA', '基因', '光合', '呼吸', 'biology', 'cell', 'gene', 'photosynthesis'],
    math: ['数学', '函数', '方程', '几何', '微积分', '三角', 'math', 'function', 'equation', 'geometry', 'calculus'],
    astronomy: ['天文', '星球', '宇宙', '黑洞', '行星', 'astronomy', 'planet', 'universe', 'black hole'],
    programming: ['编程', '算法', '数据结构', '代码', 'programming', 'algorithm', 'data structure', 'code'],
    general: [],
  };

  const lowerName = topicName.toLowerCase();
  for (const [subject, words] of Object.entries(keywords)) {
    if (words.some(word => lowerName.includes(word.toLowerCase()))) {
      return subject as import('@/types').Subject;
    }
  }
  return 'general';
}

export function detectRenderMode(topicName: string): import('@/types').RenderMode {
  const threeKeywords = ['运动', '粒子', '碰撞', '旋转', '天体', '分子', '机械', '力', '磁场', '电场', 'motion', 'particle', 'collision', 'rotation'];
  const svgKeywords = ['函数', '图像', '曲线', '图表', '统计', '证明', '几何', '坐标', 'function', 'graph', 'curve', 'chart'];
  const hybridKeywords = ['牛顿', '运动定律', '波动', '振动', '电磁', '能量', 'newton', 'wave', 'vibration', 'energy'];

  const lowerName = topicName.toLowerCase();
  const hasThree = threeKeywords.some(k => lowerName.includes(k.toLowerCase()));
  const hasSVG = svgKeywords.some(k => lowerName.includes(k.toLowerCase()));
  const hasHybrid = hybridKeywords.some(k => lowerName.includes(k.toLowerCase()));

  if (hasHybrid || (hasThree && hasSVG)) return 'hybrid';
  if (hasSVG) return 'svg';
  return 'three';
}

export function getSubjectColor(subject: import('@/types').Subject): string {
  const colors: Record<import('@/types').Subject, string> = {
    physics: 'from-blue-500 to-cyan-500',
    chemistry: 'from-orange-500 to-red-500',
    biology: 'from-green-500 to-teal-500',
    math: 'from-amber-500 to-yellow-500',
    astronomy: 'from-indigo-500 to-blue-500',
    programming: 'from-emerald-500 to-teal-500',
    general: 'from-slate-500 to-gray-500',
  };
  return colors[subject];
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}