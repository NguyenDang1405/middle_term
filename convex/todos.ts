import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTodos = query({
  handler: async (ctx) => {
    return await ctx.db.query("todos").order("desc").collect();
  },
});

export const addTodo = mutation({
  args: {
    text: v.string(),
    priority: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const todoId = await ctx.db.insert("todos", {
      text: args.text,
      completed: false,
      createdAt: Date.now(),
      priority: args.priority || "medium",
      category: args.category || "general",
    });
    return todoId;
  },
});

export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    text: v.optional(v.string()),
    completed: v.optional(v.boolean()),
    priority: v.optional(v.string()),
    category: v.optional(v.string()),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getStats = query({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    
    const byPriority = todos.reduce((acc, todo) => {
      acc[todo.priority || 'medium'] = (acc[todo.priority || 'medium'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byCategory = todos.reduce((acc, todo) => {
      acc[todo.category || 'general'] = (acc[todo.category || 'general'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      byPriority,
      byCategory,
    };
  },
});