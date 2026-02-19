import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("done"),
      v.literal("blocked")
    ),
    assignedTo: v.union(v.literal("cristina"), v.literal("jesus")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_assigned", ["assignedTo"])
    .index("by_priority", ["priority"]),

  memories: defineTable({
    content: v.string(),
    category: v.union(
      v.literal("personal"),
      v.literal("work"),
      v.literal("preference"),
      v.literal("goal"),
      v.literal("insight")
    ),
    source: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_created", ["createdAt"]),
});
