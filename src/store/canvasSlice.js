import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const initialState = {
  elements: [],
  selectedIds: [],
  groups: {},
  history: [],
  historyIndex: -1,
};

const pushHistory = (state) => {
  const snapshot = JSON.parse(
    JSON.stringify({
      elements: state.elements,
      selectedIds: state.selectedIds,
      groups: state.groups,
    })
  );

  if (state.historyIndex < state.history.length - 1) {
    state.history = state.history.slice(0, state.historyIndex + 1);
  }

  state.history.push(snapshot);

  if (state.history.length > 20) state.history.shift();

  state.historyIndex = state.history.length - 1;
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    addElement: (state, action) => {
      const e = { id: nanoid(), ...action.payload };
      state.elements.push(e);
      pushHistory(state);
    },
    updateElement: (state, action) => {
      const { id, changes } = action.payload;
      const idx = state.elements.findIndex((s) => s.id === id);
      if (idx >= 0) {
        state.elements[idx] = { ...state.elements[idx], ...changes };
        pushHistory(state);
      }
    },
    setElements: (state, action) => {
      state.elements = action.payload;
      pushHistory(state);
    },
    deleteElement: (state, action) => {
      state.elements = state.elements.filter((e) => e.id !== action.payload);
      state.selectedIds = state.selectedIds.filter(
        (id) => id !== action.payload
      );
      pushHistory(state);
    },
    select: (state, action) => {
      state.selectedIds = action.payload;
      pushHistory(state);
    },
    toggleSelect: (state, action) => {
      const id = action.payload;
      if (state.selectedIds.includes(id))
        state.selectedIds = state.selectedIds.filter((s) => s !== id);
      else state.selectedIds.push(id);
      pushHistory(state);
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        const prev = state.history[state.historyIndex];
        state.elements = JSON.parse(JSON.stringify(prev.elements));
        state.selectedIds = JSON.parse(JSON.stringify(prev.selectedIds));
        state.groups = JSON.parse(JSON.stringify(prev.groups));
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        const next = state.history[state.historyIndex];
        state.elements = JSON.parse(JSON.stringify(next.elements));
        state.selectedIds = JSON.parse(JSON.stringify(next.selectedIds));
        state.groups = JSON.parse(JSON.stringify(next.groups));
      }
    },
    reorder: (state, action) => {
      const { from, to } = action.payload;
      const arr = state.elements;
      const item = arr.splice(from, 1)[0];
      arr.splice(to, 0, item);
      pushHistory(state);
    },
    clearCanvas: (state) => {
      state.elements = [];
      state.selectedIds = [];
      state.groups = {};
      pushHistory(state);
    },
    reorderElements: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const moved = state.elements.splice(sourceIndex, 1)[0];
      state.elements.splice(destinationIndex, 0, moved);
    },
  },
});

export const {
  addElement,
  updateElement,
  setElements,
  deleteElement,
  select,
  toggleSelect,
  undo,
  redo,
  reorder,
  clearCanvas,
  reorderElements,
} = canvasSlice.actions;

export default canvasSlice.reducer;
