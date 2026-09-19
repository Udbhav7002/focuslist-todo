# 🏆 FocusList — To-Do Application 

A clean, accessible, responsive, **enterprise-grade frontend** to-do app built with **React 18 + TypeScript + Vite + Tailwind CSS**. All data persists seamlessly in `localStorage` — no backend, no tracking, pure performance.

---

## 🚀 Quick Start

```bash
npm install
npm run dev        # start dev server
npm run build      # type-check + production build
npm run preview    # preview the production build
npm run lint       # eslint (zero warnings guaranteed)
npm run typecheck  # tsc project references
```

> **Note:** `postcss.config.js` is required for Tailwind v3 to compile — it is included and configured.

---

## ✨ Elite Feature List

| Area | Features |
|---|---|
| **Tasks** | Create (title, priority, optional due date, optional tags) · **Full Inline Editing** (UI expands to edit all properties seamlessly) · complete toggle · delete |
| **Undo System** | Every delete (single or *Clear Completed*) shows a Toast notification allowing precise undo recovery for 5 seconds. |
| **Precision Ordering** | **Drag & Drop reorder with exact visual drop indicators** (blue lines above/below targets) · Keyboard reorder (`Alt+↑/↓`) · 5 advanced sort modes |
| **Due Dates** | Integrated Date picker (today onward) · intelligent badges (*Today / Tomorrow / weekday / Sep 25*) · overdue detection with red highlighting |
| **Tags** | Up to 5 per task, comma-separated · dedupe + XSS-sanitized · dedicated tag filter dropdown |
| **Filters & Search** | Live search (debounced via `useDeferredValue` for max performance) · status · priority · tag · one-click reset · persisted across reloads |
| **Data Management** | Auto-save to `localStorage` with intelligent schema-migration on read · **Export/Import JSON** (header buttons) · cross-tab synchronization |
| **Theme System** | System / Light / Dark (cycles on `D`), follows OS changes live via CSS `color-scheme` |
| **Power Tools** | `Ctrl/⌘+K` command palette (fully keyboard navigable with **strict WAI-ARIA focus trap**) · global hotkeys · shortcuts help panel (`?`) |
| **Stats Dashboard** | Total / Pending / Completed / **Overdue** cards + animated progress ring |

---

## ⌨️ Keyboard Shortcuts

| Keys | Action |
|---|---|
| `N` | Focus new-task input |
| `/` | Focus search |
| `D` | Cycle theme (system → light → dark) |
| `?` | Toggle shortcuts help |
| `Ctrl/⌘ + K` | Command palette |
| `↑` `↓` `Home` `End` | Navigate tasks (roving tabindex) |
| `Alt + ↑/↓` | Reorder task (manual sort) |
| `Enter` / `Esc` | Save / cancel edit, close palette |

---

## ♿ Elite Accessibility (WCAG 2.1 AA Compliant)

- **Strict Focus Traps:** The Command Palette modal implements a mathematically perfect WAI-ARIA focus trap. Pressing `Tab` loops infinitely inside the modal and cannot escape to the background, restoring focus upon close.
- **Roving Tabindex:** The main task list utilizes a complex roving-tabindex for `Arrow/Home/End` keyboard navigation, preventing `Tab` fatigue on large lists.
- **Semantics:** Single `<main>` landmark, visually hidden `<h2>` section headings, properly labelled landmarks, and strict `ul/li` list structures.
- **Screen Readers:** Polite `aria-live` regions for list size and stats; `role="progressbar"` with exact values; strictly semantic combobox/listbox palettes; and `aria-pressed` toggles.
- **Motion:** Full `prefers-reduced-motion` support (CSS-level + JS hook for the SVG progress ring).

---

## ⚡ Maximum Performance

- **Zero Blocking Scripts:** Optimized `index.html` `head` for perfect Lighthouse First Contentful Paint metrics.
- **Smart Rendering:** `React.memo` on all list components; stable callbacks via `useCallback`.
- **Concurrent Features:** `useDeferredValue` keeps typing responsive while filtering large datasets.
- **Off-Screen Rendering:** `content-visibility: auto` on task rows ensures off-screen elements do not impact render times.
- **Zero Heavy Dependencies:** Icons are pure inline SVGs (no `lucide-react` bloat); Drag & Drop uses the hyper-efficient native HTML5 API (no `dnd-kit`).

---

## 🏗️ Architecture

```
src/
├── App.tsx                  # Composition root: theme, hotkeys, palette, toast/undo, export/import
├── main.tsx                 # Entry point (StrictMode + createRoot)
├── index.css                # Tailwind layers, reduced-motion, content-visibility utility
├── types/index.ts           # Domain models (Todo, Priority, SortOption, TodoStats)
├── hooks/
│   ├── useTodos.ts          # State container: CRUD, undoable delete, reorder, filter/sort/selectors
│   ├── useLocalStorage.ts   # Type-safe persistence + migration (revive) + cross-tab sync
│   ├── useTheme.ts          # system/light/dark with live OS tracking
│   ├── useReducedMotion.ts  # prefers-reduced-motion tracking
│   └── useHotkeys.ts        # Global keydown subscription
├── utils/                   # Pure functions: sanitize, date math, normalization, constants
└── components/              # Presentational components (barrel export via index.ts)
```

**Design decisions**

- **Normalized storage:** Unknown/corrupt/old data is repaired on read (`normalizeTodos`), ensuring the app never white-screens on bad localStorage.
- **Single state owner:** `useTodos` is the sole source of truth for task logic; components remain highly presentational and pure.
- **Undo as data:** Deletions return `{ todo, index }` so any caller can offer precise undo states without requiring heavy state machines.
- **Strict TypeScript:** Compiled under `"strict": true` with absolutely zero `any` types. 
- **Zero ESLint Warnings:** Codebase is heavily linted and strictly adheres to `@typescript-eslint` recommended practices.

---

## 📦 Data format

Export produces:

```json
{ "app": "focuslist", "version": 2, "exportedAt": "…", "todos": [ … ] }
```

Import also accepts a bare `Todo[]` array. Invalid entries are skipped; valid ones are normalized, sanitized against XSS, and re-indexed.
