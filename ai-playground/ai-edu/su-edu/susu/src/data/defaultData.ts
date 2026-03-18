import { Topic, TopicCategory } from '@/types';

export const defaultTopics: Topic[] = [
  {
    id: 'newton-second-law',
    name: '牛顿第二定律',
    nameEn: "Newton's Second Law",
    icon: '🍎',
    description: '理解力、质量与加速度的关系',
    subject: 'physics',
    renderMode: 'hybrid',
    content: {
      learningObjectives: [
        '理解牛顿第二定律的物理意义',
        '掌握 F=ma 公式的应用',
        '能够分析简单的力学问题',
        '理解力的矢量性',
      ],
      formulas: [
        {
          id: 'f1',
          name: '牛顿第二定律',
          latex: 'F = ma',
          description: '物体的加速度与作用力成正比，与质量成反比',
        },
        {
          id: 'f2',
          name: '加速度定义',
          latex: 'a = \\frac{\\Delta v}{\\Delta t}',
          description: '加速度是速度变化率',
        },
      ],
      principles: [
        '力是改变物体运动状态的原因，而不是维持运动的原因',
        '质量是物体惯性大小的量度',
        '加速度的方向与合外力的方向相同',
        '牛顿第二定律只适用于惯性参考系',
      ],
      realWorldApplications: [
        '汽车安全气囊的设计',
        '火箭发射原理',
        '电梯的超重与失重现象',
        '体育运动中的力学分析',
      ],
      quizQuestions: [
        {
          id: 'q1',
          question: '一个质量为2kg的物体受到10N的力作用，它的加速度是多少？',
          options: ['2 m/s²', '5 m/s²', '10 m/s²', '20 m/s²'],
          correctIndex: 1,
          explanation: '根据F=ma，a=F/m=10N/2kg=5 m/s²',
        },
        {
          id: 'q2',
          question: '当物体的质量增大时，在相同力的作用下，加速度会如何变化？',
          options: ['增大', '减小', '不变', '不确定'],
          correctIndex: 1,
          explanation: '根据F=ma，质量增大时加速度减小',
        },
      ],
      visualization: {
        type: '3d',
        parameters: {
          mass: 2,
          force: 10,
          friction: 0,
        },
        controls: [
          { id: 'mass', label: '质量', type: 'slider', min: 0.5, max: 10, step: 0.5, defaultValue: 2 },
          { id: 'force', label: '作用力', type: 'slider', min: 0, max: 50, step: 1, defaultValue: 10 },
          { id: 'friction', label: '摩擦系数', type: 'slider', min: 0, max: 1, step: 0.1, defaultValue: 0 },
        ],
      },
    },
    flashcards: [
      { id: 'fc1', question: '牛顿第二定律的公式是什么？', answer: 'F = ma，其中F是力，m是质量，a是加速度' },
      { id: 'fc2', question: '力的单位是什么？', answer: '牛顿(N)，1N = 1 kg·m/s²' },
      { id: 'fc3', question: '什么是惯性？', answer: '物体保持原有运动状态的性质，质量是惯性大小的量度' },
      { id: 'fc4', question: '加速度的方向与什么相同？', answer: '与合外力的方向相同' },
    ],
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
    version: 1,
  },
  {
    id: 'photosynthesis',
    name: '光合作用',
    nameEn: 'Photosynthesis',
    icon: '🌱',
    description: '探索植物如何将光能转化为化学能',
    subject: 'biology',
    renderMode: 'three',
    content: {
      learningObjectives: [
        '理解光合作用的基本过程',
        '掌握光反应和暗反应的区别',
        '了解叶绿体的结构和功能',
        '认识光合作用的重要意义',
      ],
      formulas: [
        {
          id: 'f1',
          name: '光合作用总反应式',
          latex: '6CO_2 + 6H_2O \\xrightarrow{光} C_6H_{12}O_6 + 6O_2',
          description: '二氧化碳和水在光能作用下生成葡萄糖和氧气',
        },
      ],
      principles: [
        '光合作用分为光反应和暗反应两个阶段',
        '光反应发生在叶绿体的类囊体薄膜上',
        '暗反应（卡尔文循环）发生在叶绿体基质中',
        '光合作用是地球上最重要的能量转化过程',
      ],
      realWorldApplications: [
        '农业生产中提高作物产量的方法',
        '温室大棚的光照管理',
        '生态系统的能量流动',
        '碳中和与环境保护',
      ],
      visualization: {
        type: '3d',
        parameters: {
          lightIntensity: 50,
          co2Level: 100,
          temperature: 25,
        },
        controls: [
          { id: 'lightIntensity', label: '光照强度', type: 'slider', min: 0, max: 100, step: 5, defaultValue: 50 },
          { id: 'co2Level', label: 'CO₂浓度', type: 'slider', min: 0, max: 200, step: 10, defaultValue: 100 },
          { id: 'temperature', label: '温度(°C)', type: 'slider', min: 0, max: 40, step: 1, defaultValue: 25 },
        ],
      },
    },
    flashcards: [
      { id: 'fc1', question: '光合作用的场所是什么？', answer: '叶绿体' },
      { id: 'fc2', question: '光反应产生什么物质？', answer: 'ATP、NADPH和氧气' },
      { id: 'fc3', question: '暗反应的另一个名称是什么？', answer: '卡尔文循环' },
      { id: 'fc4', question: '光合作用释放的氧气来自哪里？', answer: '水的光解' },
    ],
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
    version: 1,
  },
  {
    id: 'trigonometric-functions',
    name: '三角函数',
    nameEn: 'Trigonometric Functions',
    icon: '📐',
    description: '探索正弦、余弦、正切函数的性质',
    subject: 'math',
    renderMode: 'svg',
    content: {
      learningObjectives: [
        '理解三角函数的定义',
        '掌握三角函数的图像特征',
        '学会三角函数的基本性质',
        '应用三角函数解决实际问题',
      ],
      formulas: [
        {
          id: 'f1',
          name: '正弦函数',
          latex: '\\sin(\\theta) = \\frac{对边}{斜边}',
          description: '正弦是对边与斜边的比值',
        },
        {
          id: 'f2',
          name: '余弦函数',
          latex: '\\cos(\\theta) = \\frac{邻边}{斜边}',
          description: '余弦是邻边与斜边的比值',
        },
        {
          id: 'f3',
          name: '勾股定理',
          latex: '\\sin^2\\theta + \\cos^2\\theta = 1',
          description: '正弦平方加余弦平方等于1',
        },
      ],
      principles: [
        '三角函数是周期函数',
        '正弦和余弦函数的周期都是2π',
        '三角函数之间存在多种恒等关系',
        '三角函数广泛应用于物理和工程',
      ],
      visualization: {
        type: '2d',
        parameters: {
          amplitude: 1,
          frequency: 1,
          phase: 0,
        },
        controls: [
          { id: 'amplitude', label: '振幅', type: 'slider', min: 0.1, max: 3, step: 0.1, defaultValue: 1 },
          { id: 'frequency', label: '频率', type: 'slider', min: 0.5, max: 5, step: 0.5, defaultValue: 1 },
          { id: 'phase', label: '相位', type: 'slider', min: 0, max: 6.28, step: 0.1, defaultValue: 0 },
        ],
      },
    },
    flashcards: [
      { id: 'fc1', question: 'sin(30°)的值是多少？', answer: '0.5 或 1/2' },
      { id: 'fc2', question: 'cos(0°)的值是多少？', answer: '1' },
      { id: 'fc3', question: 'tan(45°)的值是多少？', answer: '1' },
      { id: 'fc4', question: '正弦函数的周期是多少？', answer: '2π 或 360°' },
    ],
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
    version: 1,
  },
  {
    id: 'solar-system',
    name: '太阳系',
    nameEn: 'Solar System',
    icon: '🌍',
    description: '探索我们的太阳系和行星运动',
    subject: 'astronomy',
    renderMode: 'three',
    content: {
      learningObjectives: [
        '认识太阳系的组成',
        '理解行星运动定律',
        '了解各行星的特征',
        '认识太阳系的形成',
      ],
      principles: [
        '太阳系有八大行星',
        '行星绕太阳公转遵循开普勒定律',
        '内行星（类地行星）和外行星（类木行星）有明显区别',
        '太阳系形成于约46亿年前',
      ],
      visualization: {
        type: '3d',
        parameters: {
          orbitSpeed: 1,
          showOrbits: true,
          showLabels: true,
        },
        controls: [
          { id: 'orbitSpeed', label: '公转速度', type: 'slider', min: 0.1, max: 5, step: 0.1, defaultValue: 1 },
          { id: 'showOrbits', label: '显示轨道', type: 'toggle', defaultValue: true },
          { id: 'showLabels', label: '显示标签', type: 'toggle', defaultValue: true },
        ],
      },
    },
    flashcards: [
      { id: 'fc1', question: '太阳系有多少颗行星？', answer: '8颗：水星、金星、地球、火星、木星、土星、天王星、海王星' },
      { id: 'fc2', question: '最大的行星是哪颗？', answer: '木星' },
      { id: 'fc3', question: '离太阳最近的行星是哪颗？', answer: '水星' },
      { id: 'fc4', question: '地球绕太阳一周需要多长时间？', answer: '约365天（一年）' },
    ],
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
    version: 1,
  },
];

export const defaultCategories: TopicCategory[] = [
  {
    id: 'cat-physics',
    name: '物理学',
    icon: '⚛️',
    description: '探索自然界的运动规律',
    topicIds: ['newton-second-law'],
  },
  {
    id: 'cat-biology',
    name: '生物学',
    icon: '🧬',
    description: '了解生命的奥秘',
    topicIds: ['photosynthesis'],
  },
  {
    id: 'cat-math',
    name: '数学',
    icon: '🔢',
    description: '数学之美',
    topicIds: ['trigonometric-functions'],
  },
  {
    id: 'cat-astronomy',
    name: '天文学',
    icon: '🌌',
    description: '探索宇宙',
    topicIds: ['solar-system'],
  },
];