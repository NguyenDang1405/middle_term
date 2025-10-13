// @ts-ignore - Sẽ tồn tại sau khi chạy `npx convex dev` (tạo convex/_generated)
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Thêm Todo (mutation)
export const addTodo = mutation({
  args: { text: v.string() },
  // Lưu ý: Kiểu ctx/args sẽ được cung cấp đầy đủ sau khi chạy `npx convex dev`
  // Để tránh lỗi strict TS trước khi codegen, tạm thời annotate kiểu `any`.
  handler: async (ctx: any, args: { text: string }) => {
    const now = Date.now();
    await ctx.db.insert("todos", {
      text: args.text,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Danh sách Todo (query)
export const listTodos = query({
  args: {},
  // Sẽ thay `any` bằng `QueryCtx` sau khi `convex/_generated` được tạo.
  handler: async (ctx: any) => {
    return await ctx.db
      .query("todos")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

// Toggle completed
export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx: any, { id }: { id: string }) => {
    const todo = await ctx.db.get(id as any);
    if (!todo) return;
    await ctx.db.patch(id as any, { completed: !todo.completed, updatedAt: Date.now() });
  },
});

// Remove todo
export const removeTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx: any, { id }: { id: string }) => {
    const todo = await ctx.db.get(id as any);
    if (!todo) return; // Không tồn tại thì bỏ qua để tránh ném lỗi
    await ctx.db.delete(id as any);
  },
});

// Update todo text
export const updateTodoText = mutation({
  args: { id: v.id("todos"), text: v.string() },
  handler: async (ctx: any, { id, text }: { id: string; text: string }) => {
    const todo = await ctx.db.get(id as any);
    if (!todo) return; // Không tồn tại thì bỏ qua
    await ctx.db.patch(id as any, { text, updatedAt: Date.now() });
  },
});

// Clear completed todos
export const clearCompleted = mutation({
  args: {},
  handler: async (ctx: any) => {
    const done = await ctx.db
      .query("todos")
      .withIndex("by_completed")
      .filter((q: any) => q.eq(q.field("completed"), true))
      .collect();
    for (const t of done) {
      await ctx.db.delete(t._id);
    }
  },
});

// Set priority
export const setPriority = mutation({
  args: { id: v.id("todos"), priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")) },
  handler: async (ctx: any, { id, priority }: { id: string; priority: "low" | "medium" | "high" }) => {
    const todo = await ctx.db.get(id as any);
    if (!todo) return;
    await ctx.db.patch(id as any, { priority, updatedAt: Date.now() });
  },
});

// Set due date (timestamp ms)
export const setDueDate = mutation({
  args: { id: v.id("todos"), dueDate: v.union(v.number(), v.null()) },
  handler: async (ctx: any, { id, dueDate }: { id: string; dueDate: number | null }) => {
    const todo = await ctx.db.get(id as any);
    if (!todo) return;
    const patch: any = { updatedAt: Date.now() };
    if (dueDate === null) patch.dueDate = undefined; else patch.dueDate = dueDate;
    await ctx.db.patch(id as any, patch);
  },
});

// Search by text substring (case-insensitive)
export const searchTodos = query({
  args: { q: v.string() },
  handler: async (ctx: any, { q }: { q: string }) => {
    const all = await ctx.db.query("todos").withIndex("by_createdAt").order("desc").collect();
    const needle = q.trim().toLowerCase();
    if (!needle) return all;
    return all.filter((t: any) => (t.text || "").toLowerCase().includes(needle));
  },
});
