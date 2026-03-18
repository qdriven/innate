# Susu - 互动学习平台

让家长和孩子一起学习任何主题的互动教育平台。

## 项目概述

Susu 是一个结合 3D 可视化、闪卡和测验功能的互动学习平台。它旨在让家长和孩子能够一起探索和学习任何教育主题，通过互动的方式加深对知识的理解。

### 核心特性

1. **互动可视化** - 使用 Three.js 和 SVG 将抽象概念可视化
2. **闪卡学习** - 通过闪卡系统巩固知识
3. **测验系统** - 检验学习成果
4. **跨平台支持** - 支持 Web、桌面和移动端
5. **离线优先** - 所有数据存储在本地，支持离线使用
6. **内容更新** - 支持通过 API 更新主题内容

## 技术栈

### 前端
- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **shadcn/ui** - UI 组件库
- **Three.js / React Three Fiber** - 3D 渲染
- **Zustand** - 状态管理
- **KaTeX** - 数学公式渲染
- **Tailwind CSS** - 样式

### 后端
- **Python FastAPI** - API 服务
- **Google Gemini API** - AI 内容生成（可选）

## 项目结构

```
susu/
├── src/
│   ├── app/              # Next.js 应用路由
│   ├── components/       # React 组件
│   │   └── ui/          # shadcn/ui 组件
│   ├── data/            # 默认数据
│   ├── lib/             # 工具函数
│   ├── services/        # API 服务
│   ├── store/           # Zustand 状态管理
│   └── types/           # TypeScript 类型定义
├── backend/             # Python FastAPI 后端
│   ├── main.py         # API 主文件
│   └── requirements.txt # Python 依赖
├── public/             # 静态资源
└── package.json        # Node.js 依赖
```

## 快速开始

### 前端

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 生产模式
npm start
```

### 后端

```bash
cd backend

# 安装依赖
pip install -r requirements.txt

# 运行服务
python main.py
```

## 主要功能

### 1. 主题学习

- 每个主题包含学习目标、核心公式、原理讲解
- 互动控制面板实时调整参数
- 3D 可视化帮助理解抽象概念

### 2. 闪卡系统

- 翻卡交互设计
- 学习进度追踪
- 已掌握/需复习标记

### 3. 测验功能

- 多选题测验
- 即时反馈和解析
- 成绩统计

### 4. 数据管理

- 本地存储（localStorage）
- 导入/导出 JSON
- 版本控制和更新检查

## 默认主题

- 牛顿第二定律 (物理学)
- 光合作用 (生物学)
- 三角函数 (数学)
- 太阳系 (天文学)

## 许可证

MIT License