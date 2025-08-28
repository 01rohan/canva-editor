# 🎨 React Design Editor

A simplified Canva/Figma-like **browser-based design editor** built with React, Redux Toolkit, and `react-rnd`.  
Users can add, move, resize, rotate, align, and export elements (text, shapes, images) inside a fixed-size canvas.

---

## 🚀 Features

- Add text, rectangles, circles, lines, and images
- Snapping & alignment guides
- Resize, and rotate elements
- Multi-selection with **Shift+Click**
- Keyboard nudging (Arrow keys: 1px, Shift+Arrow: 10px)
- Undo / Redo (Ctrl+Z / Ctrl+Y)
- Dark mode support
- Export canvas to **PNG** or **PDF**

---

## 🛠️ State Management Choice

I have use **Redux Toolkit** for global state management because:

- Predictable state transitions (elements, history, selection).
- Easy to implement **undo/redo** with snapshots.
- Centralized state for **Toolbar, Canvas, Properties Panel, and Layer List**.
- Debugging with Redux DevTools.

### Alternatives:

- **Zustand** → simpler, but less suited for undo/redo tracking.
- **React Context** → would cause unnecessary re-renders for frequent updates.

---

## 📏 Snapping & Alignment

- Every element generates **candidate snap lines**:
  - Canvas edges (left, right, center).
  - Other elements (edges + centers).
- While dragging/resizing, the system checks distances (`dx` / `dy`).
- If within **8px threshold**, the element **snaps** into place and shows guides.

---

## Undo / Redo

- A **history stack** stores snapshots of the canvas state.
- On every action (`addElement`, `updateElement`, etc.), a deep snapshot is saved.
- `undo()` → move back in history.
- `redo()` → move forward in history.
- History is capped at **20 snapshots** to avoid memory bloat.

---

## ⚡ Performance Tricks

- Deep clone snapshots to avoid state mutation.
- **Selective re-renders** with `useSelector` → only update what changes.
- Snapping only computed **during drag/resize**, not every render.
- History capped to **20 entries**.
- `react-rnd` handles drag/resize efficiently without full canvas re-render.

---

## Tech Stack

- **React 19**
- **Redux Toolkit**
- **react-rnd** → drag & resize
- **react-beautiful-dnd** → layer reordering
- **TailwindCSS** → styling
- **html2canvas + jsPDF** → export

---

## ⚙️ Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/01rohan/canva-editor.git
cd canva-editor

# 2. Install dependencies
npm install --force

# 3. Start development server
npm run dev
```
