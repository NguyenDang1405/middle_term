import { mutation } from "./_generated/server";
import { v } from "convex/values";
import seedData from "./seed-data.json";

export const seedTodos = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing todos
    const existingTodos = await ctx.db.query("todos").collect();
    for (const todo of existingTodos) {
      await ctx.db.delete(todo._id);
    }

    // Insert seed data
    const insertedTodos = [];
    for (const todoData of seedData) {
      const todoId = await ctx.db.insert("todos", {
        text: todoData.text,
        completed: todoData.completed,
        createdAt: todoData.createdAt,
        priority: todoData.priority,
        category: todoData.category,
        dueDate: todoData.dueDate,
      });
      insertedTodos.push(todoId);
    }

    return {
      message: `Successfully seeded ${insertedTodos.length} todos`,
      count: insertedTodos.length,
    };
  },
});

export const clearTodos = mutation({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    for (const todo of todos) {
      await ctx.db.delete(todo._id);
    }
    return {
      message: `Cleared ${todos.length} todos`,
      count: todos.length,
    };
  },
});
