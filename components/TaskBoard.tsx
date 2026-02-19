"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@/hooks/useConvex";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type TaskStatus = "todo" | "in_progress" | "done" | "blocked";
type TaskAssignee = "cristina" | "jesus";
type TaskPriority = "low" | "medium" | "high";

interface Task {
  _id: Id<"tasks">;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo: TaskAssignee;
  priority: TaskPriority;
  createdAt: number;
  updatedAt: number;
}

const statusLabels: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
  blocked: "Blocked",
};

const statusColors: Record<TaskStatus, string> = {
  todo: "bg-slate-700 text-slate-300",
  in_progress: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  done: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  blocked: "bg-red-500/20 text-red-300 border border-red-500/30",
};

const priorityColors: Record<TaskPriority, string> = {
  low: "bg-slate-600 text-slate-400",
  medium: "bg-blue-500/20 text-blue-300",
  high: "bg-rose-500/20 text-rose-300",
};

export default function TaskBoard() {
  const tasks = useQuery(api.tasks.getAll, {}) || [];
  const createTask = useMutation(api.tasks.create);
  const updateTaskStatus = useMutation(api.tasks.updateStatus);
  const deleteTask = useMutation(api.tasks.remove);
  
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "cristina" as TaskAssignee,
    priority: "medium" as TaskPriority,
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    
    await createTask({
      title: newTask.title,
      description: newTask.description || undefined,
      assignedTo: newTask.assignedTo,
      priority: newTask.priority,
    });
    
    setNewTask({ title: "", description: "", assignedTo: "cristina", priority: "medium" });
    setShowForm(false);
  };

  const handleStatusChange = async (taskId: Id<"tasks">, status: TaskStatus) => {
    await updateTaskStatus({ id: taskId, status });
  };

  const handleDelete = async (taskId: Id<"tasks">) => {
    if (confirm("Delete this task?")) {
      await deleteTask({ id: taskId });
    }
  };

  const groupedTasks = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
    blocked: tasks.filter((t) => t.status === "blocked"),
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Task Board</h2>
          <p className="text-slate-400 mt-1">Track what we&apos;re working on</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {Object.entries(groupedTasks).map(([status, items]) => (
          <div key={status} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{items.length}</div>
            <div className="text-sm text-slate-400">{statusLabels[status as TaskStatus]}</div>
          </div>
        ))}
      </div>

      {/* New Task Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={handleCreateTask} className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold text-white mb-4">New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  placeholder="What needs to be done?"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500 h-24 resize-none"
                  placeholder="Add details..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Assigned To</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value as TaskAssignee })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="cristina">Cristina</option>
                    <option value="jesus">Jesus</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
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
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task Columns */}
      <div className="grid grid-cols-4 gap-6">
        {(Object.keys(groupedTasks) as TaskStatus[]).map((status) => (
          <div key={status} className="bg-slate-900/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-300">{statusLabels[status]}</h3>
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full">
                {groupedTasks[status].length}
              </span>
            </div>
            
            <div className="space-y-3">
              {groupedTasks[status].map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onStatusChange,
  onDelete,
}: {
  task: Task;
  onStatusChange: (id: Id<"tasks">, status: TaskStatus) => void;
  onDelete: (id: Id<"tasks">) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-white text-sm">{task.title}</h4>
        <button
          onClick={() => onDelete(task._id)}
          className="text-slate-500 hover:text-red-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {task.description && (
        <p className="text-xs text-slate-400 mt-2 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center gap-2 mt-3">
        <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
          task.assignedTo === "cristina" ? "bg-pink-500/20 text-pink-300" : "bg-cyan-500/20 text-cyan-300"
        }`}>
          {task.assignedTo === "cristina" ? "👤" : "🤖"}
          {task.assignedTo}
        </span>
      </div>
      
      <div className="mt-3 pt-3 border-t border-slate-700/50">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value as TaskStatus)}
          className={`text-xs px-2 py-1 rounded border-0 cursor-pointer ${statusColors[task.status]}`}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>
    </div>
  );
}
