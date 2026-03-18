import { InteractiveLesson } from '@/types';

export const interactiveLessons: InteractiveLesson[] = [
  {
    id: 'newton-second-law',
    title: '牛顿第二定律',
    titleEn: 'Newton\'s Second Law',
    subject: 'physics',
    htmlPath: '/lessons/newton-second-law.html',
    description: '探索力、质量和加速度之间的关系：F=ma',
    difficulty: 'beginner',
    tags: ['力学', '牛顿定律', '加速度'],
  },
  {
    id: 'kinematics',
    title: '运动学基础',
    titleEn: 'Kinematics',
    subject: 'physics',
    htmlPath: '/lessons/kinematics.html',
    description: '学习匀速运动和匀加速运动的基本概念',
    difficulty: 'beginner',
    tags: ['运动学', '速度', '加速度'],
  },
  {
    id: 'electromagnetic-induction',
    title: '电磁感应',
    titleEn: 'Electromagnetic Induction',
    subject: 'physics',
    htmlPath: '/lessons/electromagnetic-induction.html',
    description: '探索法拉第电磁感应定律和楞次定律',
    difficulty: 'intermediate',
    tags: ['电磁学', '法拉第定律', '感应电流'],
  },
  {
    id: 'time-dilation',
    title: '相对论时间膨胀',
    titleEn: 'Relativistic Time Dilation',
    subject: 'physics',
    htmlPath: '/lessons/time-dilation.html',
    description: '理解狭义相对论中的时间膨胀效应',
    difficulty: 'advanced',
    tags: ['相对论', '时间膨胀', '洛伦兹因子'],
  },
  {
    id: 'quantum-tunneling',
    title: '量子遂穿',
    titleEn: 'Quantum Tunneling',
    subject: 'physics',
    htmlPath: '/lessons/quantum-tunneling.html',
    description: '探索量子力学中的遂穿效应',
    difficulty: 'advanced',
    tags: ['量子力学', '遂穿效应', '波函数'],
  },
  {
    id: 'acid-base-neutralization',
    title: '酸碱中和',
    titleEn: 'Acid-Base Neutralization',
    subject: 'chemistry',
    htmlPath: '/lessons/acid-base-neutralization.html',
    description: '观察酸碱中和反应的3D分子模拟',
    difficulty: 'beginner',
    tags: ['酸碱', '中和反应', 'pH值'],
  },
  {
    id: 'redox-reaction',
    title: '氧化还原反应',
    titleEn: 'Redox Reaction',
    subject: 'chemistry',
    htmlPath: '/lessons/redox-reaction.html',
    description: '理解电子转移和氧化还原过程',
    difficulty: 'intermediate',
    tags: ['氧化还原', '电子转移', '化学反应'],
  },
  {
    id: 'photosynthesis',
    title: '光合作用',
    titleEn: 'Photosynthesis',
    subject: 'biology',
    htmlPath: '/lessons/photosynthesis.html',
    description: '探索植物光合作用的光反应和暗反应',
    difficulty: 'intermediate',
    tags: ['光合作用', '叶绿体', '卡尔文循环'],
  },
  {
    id: 'dna-replication',
    title: 'DNA复制',
    titleEn: 'DNA Replication',
    subject: 'biology',
    htmlPath: '/lessons/dna-replication.html',
    description: '观察DNA半保留复制的3D过程',
    difficulty: 'intermediate',
    tags: ['DNA', '复制', '遗传'],
  },
  {
    id: 'cellular-respiration',
    title: '细胞呼吸',
    titleEn: 'Cellular Respiration',
    subject: 'biology',
    htmlPath: '/lessons/cellular-respiration.html',
    description: '理解细胞呼吸的三个阶段和ATP生成',
    difficulty: 'intermediate',
    tags: ['细胞呼吸', 'ATP', '线粒体'],
  },
  {
    id: 'mitosis',
    title: '有丝分裂',
    titleEn: 'Mitosis',
    subject: 'biology',
    htmlPath: '/lessons/mitosis.html',
    description: '观察细胞有丝分裂的六个阶段',
    difficulty: 'intermediate',
    tags: ['有丝分裂', '染色体', '细胞周期'],
  },
];

export function getLessonsBySubject(subject: string): InteractiveLesson[] {
  return interactiveLessons.filter((lesson) => lesson.subject === subject);
}

export function getLessonById(id: string): InteractiveLesson | undefined {
  return interactiveLessons.find((lesson) => lesson.id === id);
}

export function searchLessons(query: string): InteractiveLesson[] {
  const lowerQuery = query.toLowerCase();
  return interactiveLessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(lowerQuery) ||
      lesson.titleEn.toLowerCase().includes(lowerQuery) ||
      lesson.description.toLowerCase().includes(lowerQuery) ||
      lesson.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
