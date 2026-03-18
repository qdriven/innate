# Task 1 Plan: Combine OpenMAIC and su-edu into a Learn Together Product

## 1. Bottom Line

This idea is achievable, but only if it is approached in layers instead of trying to fully merge everything at once.

My recommendation is:

1. use **OpenMAIC** as the **AI content generation engine**
2. use **su-edu / learn-together** as the **learner-facing product shell**
3. introduce a **shared textbook-to-chapter JSON pipeline**
4. delay full desktop packaging until the web MVP is stable

The main reason for this recommendation is that OpenMAIC is already strong at generating structured AI classroom experiences, while `su-edu` is closer to a lightweight, learner-facing, local-first study product. Trying to collapse both into one codebase immediately would create unnecessary migration risk because the projects currently use different framework generations, different product assumptions, and different data models.

## 2. What Exists Today

### OpenMAIC strengths

- mature AI classroom generation flow
- scene generation pipeline for slides, quiz, interactive content, and PBL
- multi-agent classroom interaction model
- browser-first experience already shaped like a production app
- better foundation for turning source material into rich lessons

### su-edu strengths

- lighter learning product direction
- stronger fit for parent-child learning, topic browsing, flashcards, and progress tracking
- simpler structure for local content packages and desktop packaging later
- useful starting point for a learner dashboard, offline mode, and content library

### Current integration reality

- OpenMAIC is the more advanced system
- `su-edu/susu` and `su-edu/learn-together` are still closer to product experiments / shells
- the codebases should be aligned by **content contracts and product boundaries first**, not by direct file merging

## 3. Recommended Product Direction

Build one product with two internal roles:

- **Authoring / generation side**
  - import textbook chapters
  - normalize chapter text into JSON
  - generate lesson outlines, slides, quizzes, flashcards, interactive simulations, and discussion prompts
- **Learning side**
  - browse textbook chapters by grade / subject
  - enter a chapter and choose modes such as read, learn together, flashcards, quiz, and interactive lab
  - support parent-child co-learning, teacher-student learning, or solo learning

In practice, this means:

- OpenMAIC becomes the **lesson factory**
- learn-together becomes the **lesson player**
- Susu contributes **progress, topic library, and local/offline UX ideas**

## 4. Best Integration Strategy

### Strategy recommendation

Do **not** start with a hard codebase merge.

Start with a **shared content platform**:

1. textbook source
2. parsing pipeline
3. normalized chapter JSON
4. AI enrichment pipeline
5. learning package output
6. learner application consumption

This is the safest and fastest path because it lets each system keep doing what it already does well.

### Why this is better than a direct merge

- OpenMAIC and `su-edu` are on different Next.js / React generations
- the UI models are different: one is AI-classroom-first, the other is topic-library-first
- the state models are different
- a hard merge will burn time on framework migration before validating the product

## 5. Proposed System Architecture

### Layer A: Textbook ingestion

Input:

- textbook PDFs from ChinaTextbook or other legal sources

Output:

- one JSON file per chapter

Suggested normalized chapter shape:

```json
{
  "id": "math-g1-sem1-ch01",
  "grade": "grade-1",
  "subject": "math",
  "semester": "semester-1",
  "chapterNumber": 1,
  "title": "认识数字",
  "source": {
    "bookTitle": "义务教育教科书 数学一年级上册",
    "publisher": "unknown",
    "edition": "unknown"
  },
  "content": "chapter plain text",
  "sections": [
    {
      "title": "section title",
      "content": "section plain text"
    }
  ],
  "metadata": {
    "language": "zh-CN",
    "hasImages": false,
    "needsReview": true
  }
}
```

### Layer B: Content understanding and enrichment

For each chapter JSON, produce:

- chapter summary
- learning objectives
- key concepts
- vocabulary
- flashcards
- quiz questions
- discussion prompts
- parent-child co-learning prompts
- interactive lesson suggestions
- scene generation prompt input for OpenMAIC

### Layer C: AI lesson generation

Use OpenMAIC to transform chapter materials into:

- slide lessons
- quiz scenes
- interactive HTML scenes
- PBL or guided exploration scenes
- teacher/student/parent dialogue scripts

### Layer D: Learning application

The learner app should consume a normalized package:

```json
{
  "chapter": {},
  "lesson": {},
  "flashcards": [],
  "quiz": [],
  "interactiveScenes": [],
  "discussionModes": []
}
```

The app should expose views for:

- reading mode
- learn together mode
- flashcards
- quiz
- interactive simulation
- progress dashboard

### Layer E: Desktop packaging

Only after the web app is usable:

- wrap the learner app with Tauri
- cache chapter packages locally
- support offline reading, flashcards, and quizzes
- keep AI generation online-only in the first desktop version

## 6. Product Scenarios

### Scenario A: Parent and child learn together

- choose grade and chapter
- read the textbook chapter summary together
- launch an AI teacher + AI classmate lesson
- switch into flashcards and quiz
- save progress locally

### Scenario B: Teacher prepares a lesson quickly

- select a chapter JSON
- generate a classroom in OpenMAIC
- edit or approve the generated output
- publish a learner package to students

### Scenario C: Self-learning student mode

- browse textbook chapters
- review concepts
- run practice quizzes
- revisit weak chapters with AI guidance

## 7. Advice by Scenario

### Technical advice

- choose one shared content schema before any UI merge
- keep parsing, generation, and playback as separate modules
- do not bind textbook parsing directly to the frontend
- keep OpenMAIC as an internal service boundary, not the first UI shell
- define chapter, lesson package, progress, and assessment schemas early
- build human review checkpoints into parsing and AI generation
- treat images, formulas, tables, and OCR noise as first-class problems

### Financial advice

- start with a low-cost MVP focused on a narrow slice, such as primary school math or science
- avoid broad model usage on all chapters from day one
- batch-generate reusable lesson packages offline instead of generating on every learner request
- separate expensive generation from cheap playback
- use the web MVP to validate demand before investing in desktop packaging

### Social advice

- optimize for co-learning and trust, not just AI novelty
- keep generated explanations age-appropriate and curriculum-aligned
- provide transparent source attribution per chapter
- include a feedback loop for parents and teachers to report incorrect content
- avoid positioning the product as replacing teachers; position it as guided support

### Compliance and distribution advice

- do not assume textbook redistribution rights are safe for commercial distribution
- treat textbook sourcing, redistribution, and derived-content policies as a serious product constraint
- keep a clean separation between source acquisition, internal parsing, and public product distribution rules
- if public launch is planned, validate the content rights and operational policy before scale

## 8. Advice for Different Capability Areas

### Parsing skill

- start with chapter extraction, not full semantic understanding
- accept that OCR and layout cleanup will need manual review
- create a review queue for broken chapters

### Pedagogical skill

- design outputs by age band
- keep one chapter mapped to clear objectives, questions, and recap
- include “parent asks child” and “child asks parent” interaction patterns

### AI generation skill

- constrain prompts with textbook chapter JSON instead of raw PDF whenever possible
- keep outputs structured and reviewable
- add rubric-based validation for hallucinations, age mismatch, and difficulty drift

### Product design skill

- start from chapter library and progress tracking
- add AI modes as layers, not as the only way to use the app
- support a quiet offline study mode

### Operations skill

- build content review tooling early
- tag every generated package with source chapter, model version, and review status
- keep regeneration idempotent so content can be improved over time

## 9. Easiest Part and Hardest Part

### Easiest part

The easiest part is building the **chapter library + flashcards + quiz playback** experience. The current `su-edu` structure is already close to this shape, and OpenMAIC can already generate many of the raw lesson artifacts needed.

### Hardest part

The hardest part is **reliable textbook parsing and quality control at scale**.

More specifically:

- chapter boundary detection
- OCR cleanup
- formulas, diagrams, and tables
- curriculum alignment
- hallucination control in generated lessons
- copyright / distribution decisions

This is the real project risk, not the UI.

## 10. Practical 3-Month Path

### Month 1: Foundation and narrow MVP scope

Goal:

- define the unified content schema
- choose one subject and one grade band
- prove textbook chapter parsing works

Tasks:

1. inventory target textbooks and choose a narrow pilot set
2. define chapter JSON schema
3. define lesson package schema
4. build the manual review workflow on paper first
5. test chapter extraction on 10 to 20 chapters
6. identify failure patterns: OCR noise, missing diagrams, broken chapter boundaries
7. define acceptance criteria for a “usable chapter”

Deliverable:

- a reviewed set of chapter JSON files for one pilot subject

### Month 2: AI generation and learner workflow

Goal:

- turn reviewed chapters into learning packages
- connect generated outputs to a learner UX

Tasks:

1. map chapter JSON into OpenMAIC generation inputs
2. define output packaging for flashcards, quiz, summary, and interactive scenes
3. decide which outputs require human approval before publish
4. design the learning flow: read -> discuss -> practice -> review
5. test parent-child and solo-learning scenarios on the same chapter set
6. measure generation cost and review time per chapter

Deliverable:

- end-to-end pilot for one subject with a small usable content library

### Month 3: Product hardening and desktop readiness

Goal:

- stabilize the web MVP
- prepare for desktop and broader content scale

Tasks:

1. refine progress tracking and chapter completion
2. add offline-friendly content package caching
3. add content review metadata and versioning
4. define desktop packaging boundaries
5. decide what is online-only and what is offline-capable
6. test usability with a few real users: parent-child, teacher, self-learner
7. choose whether to continue as separate services or start codebase convergence

Deliverable:

- web MVP with a clear path to Tauri packaging

## 11. Extended Roadmap After 3 Months

### Months 4 to 6

- expand to more subjects
- add better chapter search and recommendations
- add teacher publishing workflow
- add analytics for weak knowledge points
- add desktop packaging
- add local content sync

### Months 6+

- add curriculum maps and knowledge graphs
- add collaborative classroom or family room features
- add teacher dashboards
- add content marketplace or school deployment options

## 12. Concrete Implementation Task List

This is the task list I would use before writing any production code.

### Track 1: Product definition

1. define the primary user: parent-child, teacher-student, or self-learning
2. define MVP subject and grade range
3. define success metrics for one chapter and one learner session
4. define publish rules for generated content

### Track 2: Data and content contracts

1. chapter JSON schema
2. lesson package schema
3. progress schema
4. review status schema
5. source attribution schema

### Track 3: Textbook parsing pipeline

1. source inventory
2. PDF extraction strategy
3. chapter boundary rules
4. section title rules
5. formula / image handling rules
6. review queue design

### Track 4: AI generation pipeline

1. chapter-to-outline prompt design
2. outline-to-lesson generation design
3. flashcard generation design
4. quiz generation design
5. validation rubric
6. regeneration and versioning rules

### Track 5: Learner app

1. chapter library
2. chapter detail page
3. learning session flow
4. flashcards
5. quiz
6. progress dashboard
7. offline cache policy

### Track 6: Desktop

1. identify local storage needs
2. package static lesson content
3. sync update strategy
4. define online-only AI features

## 13. Recommended Build Order

If you want the most practical order:

1. chapter schema
2. chapter extraction pilot
3. reviewed chapter JSON set
4. OpenMAIC lesson generation from chapter JSON
5. learn-together playback of packaged lessons
6. progress tracking
7. offline support
8. desktop wrapper

## 14. Final Recommendation

Yes, the project is doable.

The project becomes realistic when you narrow the initial scope to:

- one learner app
- one generation backend
- one shared content schema
- one small pilot subject

The wrong approach is “merge all repos first.”

The right approach is:

- unify the content model first
- validate textbook parsing second
- validate learning workflow third
- merge product surfaces only after the workflow is proven

## 15. Notes About ChinaTextbook in This Project

The ChinaTextbook repository is useful as a **content source and parsing target**, especially because it organizes a large textbook collection by education stage and includes split-PDF handling guidance. It is suitable as an input source for experimentation, but for a serious product you should treat source rights, redistribution policy, and content review workflow as part of the product design rather than as an afterthought.
