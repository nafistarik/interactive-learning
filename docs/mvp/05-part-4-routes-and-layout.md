<!-- Verbatim section of: Visual Learning Platform - MVP 1 Master Prompt.md -->

## PART 4 — ROUTES AND LAYOUT

| Route | Page |
|---|---|
| `/` | Dashboard |
| `/learn/arrays` | Module Overview |
| `/learn/arrays/lesson/[lessonId]` | Learning Workspace (`lessonId` is `01` … `08`) |
| `/progress` | Progress |

An unknown `lessonId` shows a proper 404 page.

### 4.1 Dashboard (`/`)

Logo and navigation, a short welcome, the available module with completion %, completed
lessons, total XP, earned stars, a **Continue learning** button (opens the current lesson,
or lesson 01 for a new learner), and the theme toggle.

Show the roadmap as a preview: **Phase 0 — Arrays, Vectorization & Broadcasting**
(available), then Machine Learning, Deep Learning, Transformers, Reinforcement Learning,
Agentic AI (locked, "Coming soon"). Locked phases have no pages.

### 4.2 Module Overview (`/learn/arrays`)

Title, description, learning objectives, estimated time, the eight lessons with their
completion status, which lessons hold an exercise, overall progress, and Start/Continue.

### 4.3 Learning Workspace (`/learn/arrays/lesson/[lessonId]`)

The most important screen. One page per lesson; no separate pages for theory and code.

- **Top:** breadcrumbs (Module › Lesson), lesson progress, previous/next lesson.
- **Left:** lesson sidebar with completion marks (collapsible).
- **Main area, two views:**
  - **Theory** — explanation, interactive demos, knowledge check.
  - **Practice** — the editor and the visualization **side by side** (editor left,
    visualization right), the execution timeline below them, and the variable inspector
    beside or below the visualization. Code and visualization must be visible at the
    same time, so the user sees the highlighted line and its effect together.
- **Instruction and hint panel** for the current exercise or demo.

Desktop and tablet get the full layout. On a phone, Theory is fully readable, and
Practice shows a clear message that coding works best on a larger screen, alongside a
read-only view of the starter code.

### 4.4 Progress (`/progress`)

Total XP, stars, completed lessons and exercises, module completion %, per-lesson status,
and **Reset progress** behind a confirmation dialog.

---
