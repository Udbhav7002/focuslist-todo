# 🏆 FocusList — To-Do Application 

A clean, accessible, responsive, **enterprise-grade frontend** to-do app built with **React 18 + TypeScript + Vite + Tailwind CSS**. 

FocusList has been strictly architected using **Feature-Sliced Design (FSD)**, **Zustand** for state management, and **TanStack Virtual** for uncompromised performance. All data persists seamlessly in `localStorage` — no backend, no tracking, pure performance.

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

---

## ✨ Elite Feature List

| Area | Features |
|---|---|
| **Tasks** | Create (title, priority, optional due date, optional tags) · **Full Inline Editing** · complete toggle · delete |
| **Undo System** | **20-depth undo/redo stack**. Every interaction (add, delete, toggle, clear) can be instantly reverted via `Ctrl+Z` or the undo toast. |
| **Virtualization** | **TanStack Virtual** list virtualization. Can render tens of thousands of tasks with a completely flat DOM profile and zero scroll lag. |
| **Due Dates** | Intelligent date rendering (Today, Tomorrow, Overdue) with strict UTC parsing to prevent timezone drift bugs. |
| **Filters & Search** | Live search with **250ms debounce** to prevent expensive re-renders on keystroke · status · priority · tag · one-click reset. |
| **Data Management** | **Asynchronous, debounced auto-save** to `localStorage` (200ms) ensuring the React main thread is never blocked · JSON Export/Import. |
| **Theme System** | System / Light / Dark (cycles on `D`), follows OS changes live via CSS `color-scheme`. |
| **Power Tools** | `Ctrl/⌘+K` command palette (fully keyboard navigable with **strict WAI-ARIA focus trap**) · global hotkeys. |

---

## ⌨️ Keyboard Shortcuts

| Keys | Action |
|---|---|
| `N` | Focus new-task input |
| `/` | Focus search |
| `D` | Cycle theme (system → light → dark) |
| `Ctrl/⌘ + K` | Command palette |
| `Ctrl/⌘ + Z` | Undo last action (smartly disabled while typing) |
| `↑` `↓` | Navigate tasks (roving tabindex handled via virtualization) |
| `Enter` / `Esc` | Save / cancel inline edit, close palette |

---

## ♿ Elite Accessibility (FAIE & WCAG 2.1 AA Compliant)

- **Touch Targets:** Strictly adheres to WCAG 2.5.5. Every single button, checkbox, and input enforces a `min-w-[44px] min-h-[44px]` touch target, even if visually smaller.
- **Keyboard Navigation:** Custom roving tabindex integrated deeply into the virtualized list. You can arrow-key through thousands of virtualized rows, and focus correctly transfers to off-screen rendered items.
- **Focus Rings:** Visible focus rings (`focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400`) verified to pass 3:1 contrast ratios on both light and dark backgrounds.
- **Strict ARIA Semantics:** Command Palette features perfect `aria-autocomplete="list"` and `aria-activedescendant` combobox logic. Virtualized items are properly assigned `role="listitem"` inside a `role="region"`.
- **Focus Traps:** The Command Palette modal implements a flawless WAI-ARIA focus trap. Pressing `Tab` loops infinitely inside the modal and cannot escape to the background.

---

## ⚡ Maximum Performance

- **Zero Blocking Scripts:** `localStorage` hydration is lazy (`hydrate()`) to prevent main-thread locking during initialization, delivering a flawless TTI (Time to Interactive).
- **Zustand + Shallow Selectors:** Components subscribe *only* to their required state slice using `useShallow`. Typing in the search bar does NOT trigger a re-render of the Dashboard or Form.
- **React.memo Boundaries:** `TodoVirtualRow` is heavily memoized. The `onKeyDown` and `onToggle` callbacks are stable. Inline closures have been stripped from the render path to ensure zero wasteful re-renders.
- **DOM Efficiency:** Only the tasks currently visible in the viewport exist in the DOM, keeping the AST and memory profile flat regardless of list size.

---

## 🏗️ Architecture (Feature-Sliced Design)

```
src/
├── app/              # Application shell (App.tsx) and Zustand Store
├── entities/         # Domain models (Todo type), pure utility logic (sanitization, dates)
├── features/         # Reusable interactive features (CommandPalette)
├── shared/           # Cross-layer UI components and hooks (UndoToast, useHotkeys)
└── widgets/          # Highly cohesive blocks (TodoList, TodoForm, TodoFilters, Header)
```

**Design Decisions:**
- **Zustand over Context API:** Chosen to prevent global re-renders and enable granular subscriptions.
- **Closure-based Undo Stack:** Rather than deep-cloning large arrays in memory, the history stack saves highly-efficient patches (closures) that hold only the exact primitive ID or object needed to reverse an action.
- **Strict TypeScript:** Compiled under `"strict": true` with absolutely zero `any` types. 

---

## 📦 Data Format

Export produces a strictly typed JSON payload:

```json
{ "app": "focuslist", "version": 3, "exportedAt": "…", "todos": [ … ] }
```

Import validates the array, bypassing malformed data to guarantee absolute stability.
