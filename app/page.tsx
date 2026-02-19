"use client";

import { useState } from "react";
import TaskBoard from "@/components/TaskBoard";
import MemoryScreen from "@/components/MemoryScreen";

type Tab = "tasks" | "memory";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("tasks");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Mission Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">Cristina & Jesus</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
              activeTab === "tasks"
                ? "bg-violet-500/20 text-violet-300 border-l-2 border-violet-400"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="font-medium">Task Board</span>
          </button>

          <button
            onClick={() => setActiveTab("memory")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
              activeTab === "memory"
                ? "bg-violet-500/20 text-violet-300 border-l-2 border-violet-400"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="font-medium">Memory</span>
          </button>
        </nav>

        {/* Status */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span>System Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {activeTab === "tasks" ? <TaskBoard /> : <MemoryScreen />}
      </main>
    </div>
  );
}
