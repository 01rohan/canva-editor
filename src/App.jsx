import React, { useState, useEffect } from "react";
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";
import Toolbar from "./components/Toolbar";
import PropertiesPanel from "./components/PropertiesPanel";
import useUndoRedo from "./hooks/useUndoRedo";

export default function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useUndoRedo();

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 dark:text-white">
      <header className="flex items-center justify-between p-3 border-b bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold">Editor</h1>
        </div>
        <button
          onClick={() => setDark((d) => !d)}
          className="px-3 py-1 border rounded"
        >
          Toggle {dark ? "Light" : "Dark"}
        </button>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r bg-gray-50 dark:bg-gray-900 flex flex-col">
          <div className="border-b p-2">
            <Toolbar />
          </div>
          <div className="flex-1 overflow-y-auto">
            <Sidebar />
          </div>
        </aside>

        <section className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800 overflow-auto">
          <div
            className="relative bg-white dark:bg-gray-600 shadow-md"
            style={{ width: "600px", height: "350px" }}
          >
            <Canvas />
          </div>
        </section>

        <aside className="w-72 border-l bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          <PropertiesPanel />
        </aside>
      </main>
    </div>
  );
}
