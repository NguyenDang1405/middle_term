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
