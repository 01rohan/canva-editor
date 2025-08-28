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
      <header className="flex items-center justify-between px-6 py-3 border-b bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight">🎨 Editor</h1>
        </div>
        <button
          onClick={() => setDark((d) => !d)}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r bg-white dark:bg-gray-900 flex flex-col shadow-sm">
          <div className="border-b p-3 bg-gray-50 dark:bg-gray-800">
            <Toolbar />
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <Sidebar />
          </div>
        </aside>

        <section className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800 overflow-auto">
          <div
            className="relative rounded-xl bg-white dark:bg-gray-700 shadow-lg border border-gray-200 dark:border-gray-600"
            style={{ width: "1000px", height: "700px" }}
          >
            <Canvas />
          </div>
        </section>

        <aside className="w-72 border-l bg-white dark:bg-gray-900 overflow-y-auto shadow-sm p-4">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Properties
          </h2>
          <PropertiesPanel />
        </aside>
      </main>
    </div>
  );
}
