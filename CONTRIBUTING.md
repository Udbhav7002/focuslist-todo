# Contributing to FocusList

Thank you for your interest in contributing to FocusList! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **npm** v8 or higher

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/focuslist-todo.git
   cd focuslist-todo
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── components/          # React UI components
│   ├── EmptyState.tsx   # Empty state placeholder
│   ├── TodoFilters.tsx  # Search & filter controls
│   ├── TodoForm.tsx     # Task creation form
│   ├── TodoItem.tsx     # Individual task item
│   ├── TodoList.tsx     # Task list container
│   └── TodoStats.tsx    # Statistics dashboard
├── hooks/               # Custom React hooks
│   ├── useLocalStorage.ts  # Generic localStorage hook
│   └── useTodos.ts         # Task management logic
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions & constants
│   ├── constants.ts     # Application constants
│   └── sanitize.ts      # Input sanitization
├── App.tsx              # Root application component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🧑‍💻 Development Guidelines

### Code Style

- Use **TypeScript** for all new files.
- Add **JSDoc comments** to all exported functions, components, and types.
- Use `React.memo` for components that receive stable props.
- Use `useCallback` for event handler functions passed as props.
- Use `useMemo` for expensive computations.

### Accessibility

- Every interactive element must have an `aria-label`.
- Use `data-testid` attributes for testable elements.
- Ensure keyboard navigation works for all features.
- Use semantic HTML elements (`<main>`, `<section>`, `<header>`, `<footer>`).

### Security

- Always sanitize user input using the `sanitizeInput()` utility.
- Never use `dangerouslySetInnerHTML`.

## 🧪 Testing

Run the build to verify TypeScript compilation:

```bash
npm run build
```

## 📤 Submitting Changes

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Ensure the build passes: `npm run build`
4. Commit with a descriptive message: `git commit -m "feat: add my feature"`
5. Push and open a Pull Request

## 📝 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
