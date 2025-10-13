import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Định nghĩa schema cho database Convex
// Bảng: todos
//  - text: nội dung công việc
//  - completed: trạng thái hoàn thành
//  - createdAt: timestamp tạo (ms)
//  - index by_createdAt để truy vấn theo thời gian tạo
export default defineSchema({
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
  })
    .index("by_createdAt", ["createdAt"]) 
    .index("by_completed", ["completed"]),
});
