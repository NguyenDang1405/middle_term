"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
// @ts-ignore - Sẽ có sau khi chạy `npm run convex:dev`
import { api } from "../../convex/_generated/api";

export default function Home() {
  const todos = useQuery(api.todos.listTodos) || [];
  const addTodo = useMutation(api.todos.addTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const removeTodo = useMutation(api.todos.removeTodo);
  const updateTodoText = useMutation(api.todos.updateTodoText);
  const clearCompleted = useMutation(api.todos.clearCompleted);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const filtered = useMemo(() => {
    if (filter === "active") return todos.filter((t: any) => !t.completed);
    if (filter === "completed") return todos.filter((t: any) => t.completed);
    return todos;
  }, [todos, filter]);

  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-semibold mb-4">Todo List</h1>
      <form
        className="flex gap-2 mb-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!text.trim()) return;
          await addTodo({ text });
          setText("");
        }}
      >
        <input
          className="flex-1 border rounded px-3 py-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập công việc..."
        />
        <button className="px-4 py-2 bg-black text-white rounded" type="submit">
          Thêm
        </button>
      </form>
      <div className="flex items-center gap-2 mb-3">
        <button className={`px-2 py-1 rounded border ${filter === "all" ? "bg-black text-white" : ""}`} onClick={() => setFilter("all")}>
          All
        </button>
        <button className={`px-2 py-1 rounded border ${filter === "active" ? "bg-black text-white" : ""}`} onClick={() => setFilter("active")}>
          Active
        </button>
        <button className={`px-2 py-1 rounded border ${filter === "completed" ? "bg-black text-white" : ""}`} onClick={() => setFilter("completed")}>
          Completed
        </button>
        <div className="ml-auto">
          <button className="px-2 py-1 rounded border" onClick={() => clearCompleted({})}>Clear Completed</button>
        </div>
      </div>
      <ul className="space-y-2">
        {filtered.map((todo: any) => (
          <li key={todo._id} className="flex items-center gap-2 border rounded px-3 py-2">
            <input type="checkbox" checked={!!todo.completed} onChange={() => toggleTodo({ id: todo._id })} />
            {editingId === todo._id ? (
              <form
                className="flex-1 flex gap-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (editingText.trim()) await updateTodoText({ id: todo._id, text: editingText });
                  setEditingId(null);
                  setEditingText("");
                }}
              >
                <input
                  className="flex-1 border rounded px-2 py-1"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  autoFocus
                />
                <button className="px-2 py-1 border rounded" type="submit">Save</button>
                <button
                  className="px-2 py-1 border rounded"
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setEditingText("");
                  }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <span className={`flex-1 ${todo.completed ? "line-through text-gray-500" : ""}`}>{todo.text}</span>
                <button className="px-2 py-1 border rounded" onClick={() => { setEditingId(todo._id); setEditingText(todo.text); }}>Edit</button>
                <button className="px-2 py-1 border rounded" onClick={() => removeTodo({ id: todo._id })}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
