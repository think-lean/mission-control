import { mutation } from "./_generated/server";

// Seed initial data - run this once after setting up Convex
export const seedTasks = mutation({
  args: {},
  handler: async (ctx) => {
    const tasks = [
      {
        title: "Update LinkedIn headline",
        description: "Change to: 'LinkedIn Content for B2B Consultants | Turning Expertise into Inbound Leads'",
        status: "todo" as const,
        assignedTo: "cristina" as const,
        priority: "high" as const,
      },
      {
        title: "Request testimonial from existing client",
        description: "Ask current client for a LinkedIn recommendation or written testimonial",
        status: "todo" as const,
        assignedTo: "cristina" as const,
        priority: "high" as const,
      },
      {
        title: "Draft offer post for LinkedIn content services",
        description: "Create a compelling LinkedIn post offering content services to B2B consultants",
        status: "todo" as const,
        assignedTo: "cristina" as const,
        priority: "high" as const,
      },
      {
        title: "Send first pitch to prospect",
        description: "Reach out to first potential LinkedIn content client",
        status: "todo" as const,
        assignedTo: "cristina" as const,
        priority: "high" as const,
      },
      {
        title: "Review LinkedIn profile revamp sections",
        description: "Review the full profile revamp Jesus drafted and pick 1-2 sections to update",
        status: "todo" as const,
        assignedTo: "cristina" as const,
        priority: "medium" as const,
      },
      {
        title: "Set up lead tracking system",
        description: "Create system to track and nurture leads for Think Lean consulting",
        status: "todo" as const,
        assignedTo: "jesus" as const,
        priority: "high" as const,
      },
      {
        title: "Install useful ClawHub skills",
        description: "Research and install helpful skills from clawhub.com",
        status: "todo" as const,
        assignedTo: "jesus" as const,
        priority: "medium" as const,
      },
      {
        title: "Set up 3 core cron jobs",
        description: "Configure scheduled reminders for accountability and monitoring",
        status: "todo" as const,
        assignedTo: "jesus" as const,
        priority: "medium" as const,
      },
      {
        title: "Tournament at WSA - Saturday prep",
        description: "Tournament this Saturday at 8:00 AM - prepare schedule",
        status: "todo" as const,
        assignedTo: "cristina" as const,
        priority: "medium" as const,
      },
    ];

    const now = Date.now();
    for (const task of tasks) {
      await ctx.db.insert("tasks", {
        ...task,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { count: tasks.length };
  },
});

export const seedMemories = mutation({
  args: {},
  handler: async (ctx) => {
    const memories = [
      {
        content: "Cristina has a tournament at WSA on Saturday, February 21, 2026 at 8:00 AM",
        category: "personal" as const,
        source: "conversation 2026-02-18",
      },
      {
        content: "Mission Control dashboard deployed to Vercel on February 19, 2026",
        category: "work" as const,
        source: "deployment",
      },
      {
        content: "Primary goal: Land first LinkedIn content client for Think Lean",
        category: "goal" as const,
        source: "HEARTBEAT.md",
      },
      {
        content: "Current client count: 2 active clients",
        category: "work" as const,
        source: "MEMORY.md",
      },
      {
        content: "Cristina is extremely forgetful and requires external memory and push to stay on track",
        category: "preference" as const,
        source: "USER.md",
      },
    ];

    const now = Date.now();
    for (const memory of memories) {
      await ctx.db.insert("memories", {
        ...memory,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { count: memories.length };
  },
});
