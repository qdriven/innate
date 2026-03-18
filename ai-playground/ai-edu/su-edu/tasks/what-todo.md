# What to do

## Status: COMPLETED ✓

The **Susu** project has been created successfully at [./susu](./susu).

---

## Original Requirements

Current Status:

In current folder,
1. [aetherviz-master](./aetherviz-master) is a folder to visualize any education topic in a interactive way.
2. [gemini-flashcards-pro](./gemini-flashcards-pro) is a folder to generate flashcards for any education topic.

What I want to do is that:
1. combine these two tools to make a application to visualize any education topic in a interactive way
2. The application should support
   - Web
   - Desktop
   - Mobile
3. The education topic could be updated by user or by updating to a new version
4. the content could be all in text/markdown and in html to support the interactive visualization.
5. topic and content is updated overtime, so if desktop version, all the data should be stored in local storage, and could be updated.

The whole purpose is to making parents and child working together to learn any topic, the actually can teach each other for any topic.

Please create the whole new project in a totally separate folder, and the folder name should be [susu](./susu)

and also the documents for project overview, design, planning,tasks should be written in this folder.

The tech stack used:
1. Typescript
2. nextjs
3. shacdn-ui
4. almost same as gemini-flashcards-pro, but with nextjs and shacdn-ui
5. for backend service for update, use python fastapi to provide api for update topic and content, or call ai tools to generate contents.

---

## What Has Been Created

### Project Structure
```
susu/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── components/ui/    # shadcn/ui components
│   ├── data/            # Default topics data
│   ├── lib/             # Utility functions
│   ├── services/        # API and storage services
│   ├── store/           # Zustand state management
│   └── types/           # TypeScript types
├── backend/             # Python FastAPI backend
└── public/             # Static assets
```

### Documentation Created
- [susu-project-overview.md](./susu-project-overview.md) - Project overview
- [susu-technical-design.md](./susu-technical-design.md) - Technical design
- [susu-development-plan.md](./susu-development-plan.md) - Development plan
- [susu-tasks.md](./susu-tasks.md) - Task list

### Features Implemented
- [x] 3D visualization with Three.js/React Three Fiber
- [x] Interactive flashcard learning
- [x] Quiz system with instant feedback
- [x] Local storage for offline use
- [x] Import/Export functionality
- [x] Theme settings (dark/light/system)
- [x] FastAPI backend for updates and AI generation

### Default Topics
- Newton's Second Law (Physics)
- Photosynthesis (Biology)
- Trigonometric Functions (Math)
- Solar System (Astronomy)

### To Run the Project
```bash
cd susu
npm install
npm run dev
```

### To Run the Backend
```bash
cd susu/backend
pip install -r requirements.txt
python main.py
```