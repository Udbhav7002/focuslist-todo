# ✅ FocusList — To-Do Application (v2)

A clean, accessible, responsive, **frontend-only** to-do app built with **React 18 + TypeScript + Vite + Tailwind CSS**. All data persists in `localStorage` — no backend, no tracking.

---

## 🚀 Quick start

```bash
npm install
npm run dev        # start dev server
npm run build      # type-check + production build
npm run preview    # preview the production build
npm run lint       # eslint (zero warnings allowed)
npm run typecheck  # tsc project references
```

> **Note:** `postcss.config.js` is required for Tailwind v3 to compile — it is included.

---

## ✨ Feature list

| Area | Features |
|---|---|
| **Tasks** | Create (title, priority, optional due date, optional tags) · inline edit (Enter/Esc/blur) · complete toggle · delete |
| **Undo** | Every delete (single or *Clear Completed*) shows an Undo toast for 5 s |
| **Ordering** | Drag & drop reorder + keyboard reorder (`Alt+↑/↓` or move buttons) · 5 sort modes (manual, priority, due date, newest, A–Z) |
| **Due dates** | Date picker (today onward) · badges: *Today / Tomorrow / weekday / Sep 25* · overdue detection with red highlighting |
| **Tags** | Up to 5 per task, comma-separated · dedupe + XSS-sanitized · dedicated tag filter |
| **Filters** | Live search (debounced via `useDeferredValue`) · status · priority · tag · one-click reset · all persisted across reloads |
| **Data** | Auto-save to `localStorage` with schema-migration on read · **Export/Import JSON** (header buttons) · cross-tab sync |
| **Theme** | System / Light / Dark (cycles on `D`), follows OS changes live |
| **Power tools** | `Ctrl/⌘+K` command palette (fully keyboard navigable) · global hotkeys · shortcuts help panel (`?`) |
| **Stats** | Total / Pending / Completed / **Overdue** cards + animated progress ring |

---

## ⌨️ Keyboard shortcuts

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

## ♿ Accessibility (WCAG 2.1 AA-minded)

- **Semantics:** single `<main>` landmark, `<h2>` section headings (visually hidden), labelled landmarks, `ul/li` list structure.
- **Keyboard:** every action reachable by keyboard; roving-tabindex list navigation; visible focus rings everywhere (`:focus-visible`).
- **Screen readers:** polite live regions for list size and stats; `role="progressbar"` with values; combobox/listbox palette; `aria-pressed` toggles; descriptive `aria-label`s that include task text.
- **Motion:** full `prefers-reduced-motion` support (CSS-level + JS hook for the progress ring).
- **Target size:** interactive controls are ≥ 44 px on touch layouts.
- **Skip link** to main content; dialogs are modal with Escape to close.

---

## ⚡ Performance

- `React.memo` on all list components; stable callbacks via `useCallback`.
- `useDeferredValue` keeps typing responsive while filtering large lists.
- `content-visibility: auto` on task rows (off-screen rows are not rendered).
- React split into a separate vendor chunk; ES2020 target; no icon library (inline SVGs only — zero runtime dependencies beyond React).
- Filter/sort are memoized and only recompute when inputs change.

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

- **Normalized storage** — unknown/corrupt/old data is repaired on read (`normalizeTodos`), so the app never white-screens on bad localStorage.
- **Single state owner** — `useTodos` is the only place task logic lives; components stay presentational.
- **Undo as data** — deletes return `{ todo, index }` so any caller can offer precise undo without extra state machines.
- **Zero runtime dependencies** — icons are inline SVG; drag & drop uses the native API.

---

## 📦 Data format

Export produces:

```json
{ "app": "focuslist", "version": 2, "exportedAt": "…", "todos": [ … ] }
```

Import also accepts a bare `Todo[]` array. Invalid entries are skipped; valid ones are normalized and re-indexed.

---

## 🧪 Manual QA checklist

- [ ] Add, edit, complete, delete, undo a task
- [ ] Drag reorder (desktop) + `Alt+↑/↓` reorder
- [ ] Filter by search/status/priority/tag, then reset
- [ ] Sort by every mode
- [ ] Overdue task shows red badge + overdue stat
- [ ] Export → clear → import restores data
- [ ] Full keyboard-only run (Tab, arrows, hotkeys, palette)
- [ ] Dark/light/system theme + OS toggle while on "system"
- [ ] 300 ms throttling: typing in search stays smooth
- [ ] Zoom to 200 % and 320 px width — layout stays usable
