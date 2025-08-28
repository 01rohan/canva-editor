import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { select, toggleSelect, deleteElement } from "../store/canvasSlice";

export default function LayerList() {
  const elements = useSelector((s) => s.canvas.elements);
  const selected = useSelector((s) => s.canvas.selectedIds);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-2">
      {elements
        .slice()
        .reverse()
        .map((el, idx) => {
          const isSelected = selected.includes(el.id);
          return (
            <div
              key={el.id}
              className={`p-2 rounded border ${
                isSelected
                  ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30"
                  : "bg-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => dispatch(toggleSelect(el.id))}
                  />
                  <span className="text-sm">
                    {el.type} - {el.id.slice(0, 6)}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => dispatch(select([el.id]))}
                    className="text-xs px-2 py-1 border rounded"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => dispatch(deleteElement(el.id))}
                    className="text-xs px-2 py-1 border rounded"
                  >
                    Del
                  </button>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
