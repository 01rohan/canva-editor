import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateElement } from "../store/canvasSlice";

export default function PropertiesPanel() {
  const selected = useSelector((s) => s.canvas.selectedIds);
  const elements = useSelector((s) => s.canvas.elements);
  const dispatch = useDispatch();
  const el = elements.find((e) => e.id === selected[selected.length - 1]);
  if (!el)
    return (
      <aside className="w-80 border-l p-3 bg-white dark:bg-gray-800">
        Select an element
      </aside>
    );

  const onChange = (patch) => {
    dispatch(updateElement({ id: el.id, changes: patch }));
  };

  return (
    <aside className="w-80 border-l p-3 bg-white dark:bg-gray-800 overflow-auto dark:text-black">
      <h3 className="font-semibold">Properties — {el.type}</h3>
      <div className="mt-3 space-y-2">
        <label className="block text-sm dark:text-white">X</label>
        <input
          className="w-full p-1 border rounded"
          type="number"
          value={el.x}
          onChange={(e) => onChange({ x: Number(e.target.value) })}
        />
        <label className="block text-sm dark:text-white">Y</label>
        <input
          className="w-full p-1 border rounded"
          type="number"
          value={el.y}
          onChange={(e) => onChange({ y: Number(e.target.value) })}
        />
        <label className="block text-sm dark:text-white">Width</label>
        <input
          className="w-full p-1 border rounded"
          type="number"
          value={el.width}
          onChange={(e) => onChange({ width: Number(e.target.value) })}
        />
        <label className="block text-sm dark:text-white">Height</label>
        <input
          className="w-full p-1 border rounded"
          type="number"
          value={el.height}
          onChange={(e) => onChange({ height: Number(e.target.value) })}
        />
        <label className="block text-sm dark:text-white">Rotation</label>
        <input
          className="w-full p-1 border rounded"
          type="number"
          value={el.rotation}
          onChange={(e) => onChange({ rotation: Number(e.target.value) })}
        />

        {el.type === "text" && (
          <>
            <label className="block text-sm dark:text-white">Text</label>
            <input
              className="w-full p-1 border rounded"
              value={el.props.text}
              onChange={(e) =>
                onChange({ props: { ...el.props, text: e.target.value } })
              }
            />

            <label className="block text-sm dark:text-white">Font size</label>
            <input
              className="w-full p-1 border rounded"
              type="number"
              value={el.props.fontSize}
              onChange={(e) =>
                onChange({
                  props: { ...el.props, fontSize: Number(e.target.value) },
                })
              }
            />

            <label className="block text-sm dark:text-white">Color</label>
            <input
              className="w-full p-1 border rounded"
              type="color"
              value={el.props.color}
              onChange={(e) =>
                onChange({ props: { ...el.props, color: e.target.value } })
              }
            />

            <div className="flex gap-3 mt-2">
              <label className="flex items-center gap-1 text-sm dark:text-white">
                <input
                  type="checkbox"
                  checked={!!el.props.bold}
                  onChange={(e) =>
                    onChange({ props: { ...el.props, bold: e.target.checked } })
                  }
                />
                Bold
              </label>
              <label className="flex items-center gap-1 text-sm dark:text-white">
                <input
                  type="checkbox"
                  checked={!!el.props.italic}
                  onChange={(e) =>
                    onChange({
                      props: { ...el.props, italic: e.target.checked },
                    })
                  }
                />
                Italic
              </label>
              <label className="flex items-center gap-1 text-sm dark:text-white">
                <input
                  type="checkbox"
                  checked={!!el.props.underline}
                  onChange={(e) =>
                    onChange({
                      props: { ...el.props, underline: e.target.checked },
                    })
                  }
                />
                Underline
              </label>
            </div>
          </>
        )}

        {el.type === "rect" && (
          <>
            <label className="block text-sm">Fill</label>
            <input
              className="w-full p-1 border rounded"
              value={el.props.fill}
              onChange={(e) =>
                onChange({ props: { ...el.props, fill: e.target.value } })
              }
            />
          </>
        )}

        {el.type === "image" && (
          <>
            <label className="block text-sm dark:text-white">
              Replace Image
            </label>
            <button
              className="px-2 py-1 border rounded w-full"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    onChange({ props: { ...el.props, src: ev.target.result } });
                  };
                  reader.readAsDataURL(file);
                };
                input.click();
              }}
            >
              Replace
            </button>

            <label className="block text-sm dark:text-white mt-2">
              Opacity
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={el.props.opacity ?? 1}
              onChange={(e) =>
                onChange({
                  props: { ...el.props, opacity: parseFloat(e.target.value) },
                })
              }
              className="w-full"
            />

            <h4 className="mt-3 font-medium dark:text-white">Crop</h4>
            <label className="block text-sm dark:text-white">X</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={el.props.crop?.x ?? 0}
              onChange={(e) =>
                onChange({
                  props: {
                    ...el.props,
                    crop: { ...el.props.crop, x: parseFloat(e.target.value) },
                  },
                })
              }
              className="w-full"
            />
            <label className="block text-sm dark:text-white">Y</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={el.props.crop?.y ?? 0}
              onChange={(e) =>
                onChange({
                  props: {
                    ...el.props,
                    crop: { ...el.props.crop, y: parseFloat(e.target.value) },
                  },
                })
              }
              className="w-full"
            />
            <label className="block text-sm dark:text-white">Width</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={el.props.crop?.width ?? 1}
              onChange={(e) =>
                onChange({
                  props: {
                    ...el.props,
                    crop: {
                      ...el.props.crop,
                      width: parseFloat(e.target.value),
                    },
                  },
                })
              }
              className="w-full"
            />
            <label className="block text-sm dark:text-white">Height</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={el.props.crop?.height ?? 1}
              onChange={(e) =>
                onChange({
                  props: {
                    ...el.props,
                    crop: {
                      ...el.props.crop,
                      height: parseFloat(e.target.value),
                    },
                  },
                })
              }
              className="w-full"
            />
          </>
        )}
      </div>
    </aside>
  );
}
