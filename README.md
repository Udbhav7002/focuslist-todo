# FocusList

A frontend-only to-do app built with React 18, TypeScript, Vite, and Tailwind CSS. State is managed with Zustand, long lists are virtualized with TanStack Virtual, and everything persists to `localStorage` — there is no backend.

## Getting started

```bash
npm install
npm run dev        # start dev server
npm run build      # type-check + production build
npm run preview    # preview the production build
npm run lint       # eslint, exits non-zero on any warning
npm run typecheck  # tsc project references
```

## Features

- Tasks with a title, priority, optional due date, and optional tags. Inline editing, complete toggle, and delete.
- 20-step undo/redo stack. Add, delete, toggle, and clear can all be reverted with `Ctrl/⌘+Z` or the undo toast.
- TanStack Virtual keeps only the visible rows in the DOM, so long lists scroll smoothly.
- Due dates render as Today, Tomorrow, or Overdue, and are parsed in UTC to avoid timezone drift.
- Live search with a 250ms debounce, plus filters by status, priority, and tag.
- Auto-save to `localStorage` with a 200ms debounce, plus JSON export and import.
- System / light / dark theme that follows OS changes (cycles on `D`).
- Command palette (`Ctrl/⌘+K`) with full keyboard navigation and an ARIA focus trap.

## Keyboard shortcuts

| Keys | Action |
|---|---|
| `N` | Focus the new-task input |
| `/` | Focus search |
| `D` | Cycle theme (system → light → dark) |
| `Ctrl/⌘ + K` | Command palette |
| `Ctrl/⌘ + Z` | Undo last action (disabled while typing in an input) |
| `↑` `↓` | Move focus through the task list |
| `Enter` / `Esc` | Save or cancel an inline edit; close the palette |

## Accessibility

The app targets WCAG 2.1 AA:

- All buttons, checkboxes, and inputs keep a 44px minimum touch target, even when visually smaller (WCAG 2.5.5).
- A roving tabindex is integrated with the virtualized list, so arrow keys move focus correctly through off-screen rows.
- Visible focus rings with 3:1 contrast on both light and dark backgrounds.
- The command palette is an ARIA combobox (`aria-autocomplete="list"` with `aria-activedescendant`), and its modal traps `Tab` focus until closed.
- Virtualized items get `role="listitem"` inside a `role="region"`.

## Performance notes

- `localStorage` hydration is lazy so it does not block the main thread during startup.
- Components subscribe to individual state slices via `useShallow`; typing in the search box does not re-render the list or form.
- `TodoVirtualRow` is memoized with stable callbacks to avoid redundant re-renders.
- Only tasks currently in the viewport exist in the DOM, so memory use stays flat as the list grows.

## Architecture

The source is organized with Feature-Sliced Design:

```
src/
├── app/              # Application shell (App.tsx) and Zustand store
├── entities/         # Domain models (Todo type), pure utilities (sanitization, dates)
├── features/         # Interactive features (CommandPalette)
├── shared/           # Cross-layer UI and hooks (UndoToast, useHotkeys)
└── widgets/          # Cohesive blocks (TodoList, TodoForm, TodoFilters, Header)
```

Design decisions:

- Zustand over the Context API, for granular subscriptions instead of global re-renders.
- The undo stack stores closures (patches) rather than deep-cloned state, so each entry only holds the data needed to reverse one action.
- TypeScript `strict` mode, no `any`.

## Data format

Export produces a JSON payload:

```json
{ "app": "focuslist", "version": 3, "exportedAt": "…", "todos": [ … ] }
```

Import accepts a top-level array or an object with a `todos` array and rejects files without a valid task list.

## License

MIT — see [LICENSE](LICENSE).
