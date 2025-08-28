import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { addElement, clearCanvas, redo, undo } from "../store/canvasSlice";

export default function Toolbar() {
  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      dispatch(
        addElement({
          type: "image",
          x: 100,
          y: 100,
          width: 200,
          height: 150,
          rotation: 0,
          props: { src: ev.target.result },
        })
      );
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() =>
          dispatch(
            addElement({
              type: "text",
              x: 120,
              y: 120,
              width: 200,
              height: 40,
              rotation: 0,
              props: {
                text: "Hello",
                fontSize: 18,
                bold: false,
                italic: false,
                color: "#111827",
              },
            })
          )
        }
        className="px-3 py-1 border rounded w-full"
      >
        Add Text
      </button>
      <button
        onClick={() =>
          dispatch(
            addElement({
              type: "rect",
              x: 50,
              y: 50,
              width: 120,
              height: 60,
              rotation: 0,
              props: { fill: "#ef4444" },
            })
          )
        }
        className="px-3 py-1 border rounded w-full"
      >
        Add Rectangle
      </button>

      <button
        onClick={() =>
          dispatch(
            addElement({
              type: "circle",
              x: 80,
              y: 80,
              width: 80,
              height: 80,
              rotation: 0,
              props: { fill: "#60a5fa" },
            })
          )
        }
        className="px-3 py-1 border rounded w-full"
      >
        Add Circle
      </button>

      <button
        onClick={() =>
          dispatch(
            addElement({
              type: "line",
              x: 100,
              y: 200,
              width: 200,
              height: 2,
              rotation: 0,
              props: { stroke: "#000", strokeWidth: 2 },
            })
          )
        }
        className="px-3 py-1 border rounded w-full"
      >
        Add Line
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <button
        onClick={() => fileInputRef.current.click()}
        className="px-3 py-1 border rounded w-full"
      >
        Upload Image
      </button>

      <button
        onClick={() => dispatch(undo())}
        className="px-3 py-1 border rounded w-full"
      >
        Undo
      </button>
      <button
        onClick={() => dispatch(redo())}
        className="px-3 py-1 border rounded w-full"
      >
        Redo
      </button>

      <button
        onClick={() => dispatch(clearCanvas())}
        className="px-3 py-1 border rounded w-full"
      >
        Clear
      </button>
    </div>
  );
}
