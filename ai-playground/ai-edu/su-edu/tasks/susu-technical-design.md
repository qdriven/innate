# Susu 技术设计

## 1. 架构设计

### 1.1 前端架构

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 主页
│   └── globals.css        # 全局样式
├── components/
│   ├── ui/                # shadcn/ui 组件
│   ├── Sidebar.tsx        # 侧边栏
│   ├── MainContent.tsx    # 主内容区
│   ├── LearningView.tsx   # 学习视图
│   ├── FlashcardsView.tsx # 闪卡视图
│   ├── QuizView.tsx       # 测验视图
│   ├── SettingsView.tsx   # 设置视图
│   ├── Visualization3D.tsx# 3D 可视化
│   └── EmptyState.tsx     # 空状态
├── store/
│   └── index.ts           # Zustand 状态管理
├── types/
│   └── index.ts           # TypeScript 类型定义
├── lib/
│   └── utils.ts           # 工具函数
├── data/
│   └── defaultData.ts     # 默认数据
└── services/              # API 服务（预留）
```

### 1.2 后端架构

```
backend/
├── main.py                # FastAPI 主文件
├── requirements.txt       # Python 依赖
├── README.md              # 后端文档
└── data/                  # 数据存储目录（运行时创建）
    ├── topics.json        # 主题数据
    └── manifest.json      # 更新清单
```

## 2. 数据模型

### 2.1 核心实体

```typescript
// 主题
interface Topic {
  id: string;
  name: string;
  nameEn?: string;
  icon: string;
  description: string;
  subject: Subject;
  renderMode: RenderMode;
  content: TopicContent;
  flashcards: Flashcard[];
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

// 闪卡
interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// 测验题目
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// 可视化配置
interface VisualizationConfig {
  type: '3d' | '2d' | 'animation';
  parameters: Record<string, number | string | boolean>;
  controls: VisualizationControl[];
}
```

### 2.2 状态管理

使用 Zustand 进行全局状态管理，支持持久化到 localStorage：

```typescript
interface AppState {
  // 数据
  topics: Topic[];
  categories: TopicCategory[];
  selectedTopicId: string | null;
  userProgress: UserProgress[];
  settings: AppSettings;

  // UI 状态
  sidebarOpen: boolean;
  currentView: 'learn' | 'flashcards' | 'quiz' | 'settings';

  // 操作方法
  setSelectedTopic: (id: string | null) => void;
  addTopic: (topic: Topic) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  // ... 更多方法
}
```

## 3. 可视化系统

### 3.1 渲染模式选择

根据主题内容自动选择渲染方式：

| 主题特征 | 渲染模式 | 示例 |
|---------|---------|------|
| 空间感、立体结构 | Three.js 3D | 分子结构、天体运动 |
| 2D 图表、函数 | SVG Overlay | 函数曲线、统计图 |
| 复杂场景 | 混合模式 | 物理模拟+数据图表 |

### 3.2 Three.js 场景配置

使用 React Three Fiber 进行 3D 渲染：

```tsx
<Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
  <OrbitControls enablePan enableZoom enableRotate />
  <Scene type={type} parameters={parameters} subject={subject} />
</Canvas>
```

### 3.3 预设场景

- **牛顿第二定律**: 立方体运动模拟，力的可视化
- **太阳系**: 行星轨道运动
- **光合作用**: 叶绿体粒子动画
- **三角函数**: 2D 函数图像（SVG）

## 4. 用户交互

### 4.1 学习流程

```
选择主题 → 查看可视化 → 调整参数 → 阅读原理 → 练习闪卡 → 参加测验
```

### 4.2 闪卡交互

- 点击翻卡
- 标记掌握状态
- 进度追踪

### 4.3 测验交互

- 选择答案
- 即时反馈
- 解析展示
- 成绩统计

## 5. 数据持久化

### 5.1 本地存储

使用 localStorage 存储所有用户数据：
- 主题数据
- 学习进度
- 用户设置

### 5.2 导入/导出

支持 JSON 格式的数据导入导出，方便备份和迁移。

### 5.3 更新机制

通过后端 API 检查更新：
1. 客户端发送当前版本
2. 服务端比较版本号
3. 返回更新清单
4. 客户端下载并合并数据

## 6. 主题配色

### 6.1 学科主题色

| 学科 | 主色调 | 渐变 |
|------|--------|------|
| 物理 | 蓝色 | from-blue-500 to-cyan-500 |
| 化学 | 橙红 | from-orange-500 to-red-500 |
| 生物 | 翠绿 | from-green-500 to-teal-500 |
| 数学 | 金黄 | from-amber-500 to-yellow-500 |
| 天文 | 深蓝 | from-indigo-500 to-blue-500 |
| 编程 | 代码青 | from-emerald-500 to-teal-500 |

### 6.2 UI 主题

- 深色模式为主
- 玻璃拟态效果
- 霓虹强调色

## 7. 性能优化

### 7.1 代码分割

- 动态导入 3D 可视化组件
- 按需加载 UI 组件

### 7.2 渲染优化

- React.memo 缓存组件
- useMemo/useCallback 优化计算

### 7.3 资源优化

- 图片懒加载
- 字体预加载

## 8. 扩展性设计

### 8.1 新增主题类型

通过定义新的可视化场景组件即可支持新主题类型。

### 8.2 AI 内容生成

预留了与 Gemini API 集成的接口，可以自动生成闪卡和测验题目。

### 8.3 多语言支持

类型定义中预留了 nameEn 字段，支持中英双语。