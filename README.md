# FocusList — To-Do Application

> **Build. Organize. Simplify.**

A clean, accessible, and fully responsive frontend-only To-Do application built with React, TypeScript, and Tailwind CSS. Designed for the FocusList Challenge.

---

## ✅ Features — Problem Alignment

FocusList implements **all required features** from the problem statement:

### 1. Task Creation
Users can add a new task by entering a task title and selecting a priority level. Input is sanitized to prevent XSS attacks.

### 2. Task Management
Users can:
- **Mark tasks as completed** — Click the circle icon to toggle completion status
- **Edit existing tasks** — Click the pencil icon to enter inline edit mode (Enter to save, Escape to cancel)
- **Delete tasks** — Click the trash icon to permanently remove a task

### 3. Task Priority
Each task has a priority level:
- 🔴 **High** — Red badge
- 🟡 **Medium** — Amber badge
- 🔵 **Low** — Blue badge

Priority is clearly visible via color-coded badges on every task.

### 4. Search and Filtering
Users can:
- **Search tasks by title** — Real-time search input
- **Filter by status** — All, Active, Completed
- **Filter by priority** — All, High, Medium, Low

Search and filters update the displayed task list immediately.

### 5. Task Statistics
The statistics dashboard displays:
- **Total Tasks** — Count of all tasks
- **Pending Tasks** — Count of incomplete tasks
- **Completed Tasks** — Count of completed tasks
- **Progress Bar** — Visual completion percentage

All values update reactively when task data changes.

### 6. Data Persistence
Tasks persist after page refresh using the browser's **LocalStorage API**. No backend or external database is used.

---

## 🌟 Innovation & Bonus Features

Beyond the required features, FocusList includes:

- **🌙 Dark Mode** — Toggle between light and dark themes (respects system preference)
- **⌨️ Keyboard Shortcuts** — Press `N` for new task, `/` to search, `D` to toggle dark mode
- **📊 Progress Bar** — Visual completion tracker with gradient animation
- **🧹 Clear Completed** — Bulk action to remove all completed tasks
- **🔒 Input Sanitization** — XSS prevention for all user inputs
- **♿ Full Accessibility** — ARIA labels, live regions, keyboard navigation, focus management
- **📱 Responsive Design** — Works beautifully on mobile, tablet, and desktop

---

## 🏗️ Architecture

The project follows a **component-driven architecture** with clear separation of concerns:

```
src/
├── components/          # Presentational UI components
│   ├── EmptyState.tsx   # Empty state placeholder
│   ├── TodoFilters.tsx  # Search & filter controls
│   ├── TodoForm.tsx     # Task creation form
│   ├── TodoItem.tsx     # Individual task rendering
│   ├── TodoList.tsx     # Task list container
│   └── TodoStats.tsx    # Statistics dashboard
├── hooks/               # Custom React hooks (business logic)
│   ├── useLocalStorage.ts  # Generic localStorage abstraction
│   └── useTodos.ts         # Todo CRUD, filtering, and stats
├── types/               # TypeScript type definitions
│   └── index.ts         # Todo, Priority, StatusFilter, TodoStats
├── utils/               # Pure utility functions
│   ├── constants.ts     # App-wide constants (no magic strings)
│   └── sanitize.ts      # Input sanitization & validation
├── App.tsx              # Root component (composition & global state)
├── main.tsx             # Entry point
└── index.css            # Global styles with Tailwind
```

### Design Decisions

| Decision | Rationale |
|---|---|
| **Custom `useLocalStorage` hook** | Generic, reusable abstraction over localStorage with error handling |
| **`useTodos` hook** | Separates all business logic from UI components |
| **`React.memo` on all components** | Prevents unnecessary re-renders for performance |
| **`useCallback` on all handlers** | Stable function references for memoized child components |
| **`useMemo` for filtered todos & stats** | Avoids recomputing on every render |
| **Constants file** | Eliminates magic strings, single source of truth |
| **Input sanitization** | Prevents XSS and ensures data integrity |
| **`data-testid` attributes** | Enables automated testing and FAIE evaluation |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- npm v8+

### Installation

```bash
git clone https://github.com/Udbhav7002/focuslist-todo.git
cd focuslist-todo
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## ♿ Accessibility

FocusList is designed to be fully accessible:

- **Semantic HTML** — Uses `<main>`, `<header>`, `<footer>`, `<section>`, `<form>`, `<ul>`, `<li>`
- **ARIA Labels** — Every interactive element has a descriptive `aria-label`
- **ARIA Live Regions** — Screen readers announce task list and statistics changes
- **Skip Navigation** — "Skip to main content" link for keyboard users
- **Focus Management** — Proper focus rings via `focus-visible` and automatic focus on edit mode
- **Keyboard Navigation** — Full Tab navigation, Enter/Escape in edit mode, global shortcuts
- **Color Contrast** — Meets WCAG 2.1 AA standards in both light and dark modes
- **Responsive Text** — Scales properly across all viewport sizes

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | Static Typing |
| [Vite](https://vitejs.dev/) | Build Tool |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first Styling |
| [Lucide React](https://lucide.dev/) | Icon Library |
| LocalStorage API | Client-side Persistence |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) for details.
