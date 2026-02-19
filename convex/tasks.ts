import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all tasks with optional filtering
export const getAll = query({
  args: {
    status: v.optional(v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("done"),
      v.literal("blocked")
    )),
    assignedTo: v.optional(v.union(v.literal("cristina"), v.literal("jesus"))),
  },
  handler: async (ctx, args) => {
    let tasks = await ctx.db.query("tasks").order("desc").take(100);
    
    if (args.status) {
      tasks = tasks.filter(t => t.status === args.status);
    }
    if (args.assignedTo) {
      tasks = tasks.filter(t => t.assignedTo === args.assignedTo);
    }
    
    return tasks;
  },
});

// Get tasks by status
export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("done"),
      v.literal("blocked")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_status", q => q.eq("status", args.status))
      .order("desc")
      .take(50);
  },
});

// Create a new task
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    assignedTo: v.union(v.literal("cristina"), v.literal("jesus")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("tasks", {
      ...args,
      status: "todo",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update task status
export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("done"),
      v.literal("blocked")
    ),
  },
  handler: async (ctx, args) => {
    const update: any = {
      status: args.status,
      updatedAt: Date.now(),
    };
    
    if (args.status === "done") {
      update.completedAt = Date.now();
    }
    
    await ctx.db.patch(args.id, update);
  },
});

// Update task
export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    assignedTo: v.optional(v.union(v.literal("cristina"), v.literal("jesus"))),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete task
export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
