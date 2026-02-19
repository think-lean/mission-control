"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@/hooks/useConvex";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type MemoryCategory = "personal" | "work" | "preference" | "goal" | "insight";

interface Memory {
  _id: Id<"memories">;
  content: string;
  category: MemoryCategory;
  source?: string;
  createdAt: number;
  updatedAt: number;
}

const categoryLabels: Record<MemoryCategory, string> = {
  personal: "Personal",
  work: "Work",
  preference: "Preference",
  goal: "Goal",
  insight: "Insight",
};

const categoryColors: Record<MemoryCategory, string> = {
  personal: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  work: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  preference: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  goal: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  insight: "bg-violet-500/20 text-violet-300 border-violet-500/30",
};

export default function MemoryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory | "all">("all");
  const [showForm, setShowForm] = useState(false);
  
  const memories = useQuery(
    api.memories.search,
    searchQuery ? { query: searchQuery, limit: 50 } : "skip"
  ) || useQuery(api.memories.getAll, { limit: 100 }) || [];
  
  const stats = useQuery(api.memories.getStats) || { total: 0, byCategory: {} };
  const createMemory = useMutation(api.memories.create);
  const deleteMemory = useMutation(api.memories.remove);
  
  const [newMemory, setNewMemory] = useState({
    content: "",
    category: "insight" as MemoryCategory,
    source: "",
  });

  const filteredMemories = selectedCategory === "all" 
    ? memories 
    : memories.filter((m: Memory) => m.category === selectedCategory);

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemory.content.trim()) return;
    
    await createMemory({
      content: newMemory.content,
      category: newMemory.category,
      source: newMemory.source || undefined,
    });
    
    setNewMemory({ content: "", category: "insight", source: "" });
    setShowForm(false);
  };

  const handleDelete = async (id: Id<"memories">) => {
    if (confirm("Delete this memory?")) {
      await deleteMemory({ id });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Memory</h2>
          <p className="text-slate-400 mt-1">Everything I remember about you</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Memory
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-slate-400">Total Memories</div>
        </div>
        {(Object.keys(categoryLabels) as MemoryCategory[]).map((cat) => (
          <div key={cat} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{stats.byCategory[cat] || 0}</div>
            <div className="text-sm text-slate-400">{categoryLabels[cat]}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memories..."
            className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as MemoryCategory | "all")}
          className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-violet-500"
        >
          <option value="all">All Categories</option>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* New Memory Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={handleCreateMemory} className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold text-white mb-4">Add Memory</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Content</label>
                <textarea
                  value={newMemory.content}
                  onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500 h-32 resize-none"
                  placeholder="What should I remember?"
                  autoFocus
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Category</label>
                  <select
                    value={newMemory.category}
                    onChange={(e) => setNewMemory({ ...newMemory, category: e.target.value as MemoryCategory })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  >
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Source (optional)</label>
                  <input
                    type="text"
                    value={newMemory.source}
                    onChange={(e) => setNewMemory({ ...newMemory, source: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    placeholder="Where did this come from?"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors font-medium"
              >
                Save Memory
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Memories List */}
      <div className="space-y-4">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-slate-500 text-lg">
              {searchQuery ? "No memories found matching your search" : "No memories yet"}
            </p>
            <p className="text-slate-600 text-sm mt-2">
              {searchQuery ? "Try a different search term" : "Add your first memory to get started"}
            </p>
          </div>
        ) : (
          filteredMemories.map((memory: Memory) => (
            <div
              key={memory._id}
              className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-slate-200 leading-relaxed">{memory.content}</p>
                  
                  <div className="flex items-center gap-3 mt-4">
                    <span className={`text-xs px-2 py-1 rounded border ${categoryColors[memory.category]}`}>
                      {categoryLabels[memory.category]}
                    </span>
                    
                    {memory.source && (
                      <span className="text-xs text-slate-500">
                        Source: {memory.source}
                      </span>
                    )}
                    
                    <span className="text-xs text-slate-600">
                      {formatDate(memory.createdAt)}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(memory._id)}
                  className="text-slate-600 hover:text-red-400 transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
