import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all memories
export const getAll = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;
    return await ctx.db
      .query("memories")
      .order("desc")
      .take(limit);
  },
});

// Search memories by content
export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const searchLower = args.query.toLowerCase();
    
    const memories = await ctx.db
      .query("memories")
      .order("desc")
      .take(500);
    
    return memories
      .filter(m => m.content.toLowerCase().includes(searchLower))
      .slice(0, limit);
  },
});

// Get memories by category
export const getByCategory = query({
  args: {
    category: v.union(
      v.literal("personal"),
      v.literal("work"),
      v.literal("preference"),
      v.literal("goal"),
      v.literal("insight")
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await ctx.db
      .query("memories")
      .withIndex("by_category", q => q.eq("category", args.category))
      .order("desc")
      .take(limit);
  },
});

// Create a new memory
export const create = mutation({
  args: {
    content: v.string(),
    category: v.union(
      v.literal("personal"),
      v.literal("work"),
      v.literal("preference"),
      v.literal("goal"),
      v.literal("insight")
    ),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("memories", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update memory
export const update = mutation({
  args: {
    id: v.id("memories"),
    content: v.optional(v.string()),
    category: v.optional(v.union(
      v.literal("personal"),
      v.literal("work"),
      v.literal("preference"),
      v.literal("goal"),
      v.literal("insight")
    )),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete memory
export const remove = mutation({
  args: {
    id: v.id("memories"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get memory stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const memories = await ctx.db.query("memories").collect();
    
    const stats = {
      total: memories.length,
      byCategory: {
        personal: 0,
        work: 0,
        preference: 0,
        goal: 0,
        insight: 0,
      } as Record<string, number>,
    };
    
    for (const m of memories) {
      stats.byCategory[m.category] = (stats.byCategory[m.category] || 0) + 1;
    }
    
    return stats;
  },
});
