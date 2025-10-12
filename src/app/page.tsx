"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
// @ts-ignore - Sẽ có sau khi chạy `npm run convex:dev`
import { api } from "../../convex/_generated/api";

export default function Home() {
  const todos = useQuery(api.todos.listTodos) || [];
  const addTodo = useMutation(api.todos.addTodo);
  const [text, setText] = useState("");

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
      <ul className="space-y-2">
        {todos.map((todo: any) => (
          <li key={todo._id} className="border rounded px-3 py-2">
            {todo.text}
          </li>
        ))}
      </ul>
    </main>
  );
}
