# FocusList To-Do App

> **Build. Organize. Simplify.**
> A frontend-only, highly accessible, and fully responsive To-Do application built for the FocusList Challenge.

![App Preview](https://via.placeholder.com/800x400.png?text=FocusList+App)

## 🎯 Problem Alignment & Features

FocusList fully satisfies all requirements specified in the FAIE Problem Statement:

1. **Task Creation**: Add new tasks rapidly with Enter key or button click.
2. **Task Management**: Seamlessly edit text, toggle completion, and delete tasks.
3. **Task Priority**: Assign `High`, `Medium`, or `Low` priority to every task. Visual badges identify priority at a glance.
4. **Search and Filtering**: 
   - Instant title search.
   - Filter by Status (All / Active / Completed).
   - Filter by Priority (All / High / Medium / Low).
5. **Task Statistics**: Real-time dashboard tracking Total, Pending, and Completed tasks.
6. **Data Persistence**: 100% Client-side persistence using `localStorage`. No data is lost on page refresh.

## 🏗️ Architecture & Code Quality

The application strictly follows modern React best practices to ensure high maintainability and clean architecture:

- **Component-Driven**: Split into modular components (`TodoForm`, `TodoItem`, `TodoStats`) rather than a monolithic file.
- **Custom Hooks**: Business logic and state management are abstracted into `useTodos.ts`.
- **Strong Typing**: 100% TypeScript coverage with defined interfaces for `Todo` and `Priority`.
- **Tailwind CSS**: Utility-first styling for a completely responsive, design-system-aligned UI without bloated stylesheets.
- **Vite Setup**: Fast, modern bundler setup replacing legacy CRA.

## 🚀 Setup & Installation

Since this is a frontend-only application, getting started is extremely simple.

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/Udbhav7002/focuslist-todo.git
   cd focuslist-todo
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
   The app will be available at `http://localhost:5173`.

4. Build for production:
   \`\`\`bash
   npm run build
   \`\`\`

## ♿ Accessibility & UI/UX

FocusList is designed to be usable by everyone.

- **ARIA Compliant**: Every interactive element includes precise `aria-label`s and `aria-pressed` states.
- **Keyboard Navigable**: Full support for Tab navigation and Enter/Escape key interactions for forms and editing.
- **Responsive**: Fluid layouts that look beautiful on mobile, tablet, and desktop monitors.
- **Visual Feedback**: Hover states, focus rings (using Tailwind's `focus:ring`), and distinct styling for completed vs active tasks.

## 🛠️ Technology Stack
- **React 18** (UI Library)
- **TypeScript** (Static Typing)
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)
- **Local Storage API** (Database constraint workaround)
