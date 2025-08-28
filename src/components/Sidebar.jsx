import React from "react";
import LayerList from "./LayerList";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white dark:bg-gray-800 p-3 overflow-auto">
      <h2 className="font-semibold mb-2">Layers</h2>
      <LayerList />
    </aside>
  );
}
