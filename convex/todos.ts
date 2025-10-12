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
      .withIndex("by_createdAt")
      .filter((q: any) => q.eq(q.field("completed"), true))
      .collect();
    for (const t of done) {
      await ctx.db.delete(t._id);
    }
  },
});
