"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
// @ts-ignore - Sẽ có sau khi chạy `npm run convex:dev`
import { api } from "../../convex/_generated/api";

export default function Home() {
  const todos = useQuery(api.todos.getTodos);
  const addTodo = useMutation(api.todos.addTodo);
  const updateTodo = useMutation(api.todos.updateTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");

  const total = todos?.length ?? 0;
  const completedCount = (todos ?? []).filter((t: any) => t.completed).length;
  const activeCount = total - completedCount;

  const formatDateForInput = (ts: number) => {
    const d = new Date(ts);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const filtered = useMemo(() => {
    if (!todos) return [] as any[];
    let list = todos as any[];
    if (filter === "active") list = list.filter((t: any) => !t.completed);
    if (filter === "completed") list = list.filter((t: any) => t.completed);
    const needle = search.trim().toLowerCase();
    if (needle) list = list.filter((t: any) => (t.text || "").toLowerCase().includes(needle));
    return list;
  }, [todos, filter, search]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 p-6 sm:p-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-black to-zinc-500">
            Todo List
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Quản lý công việc nhanh, gọn, đẹp ✨</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white/70 backdrop-blur shadow-sm p-4 sm:p-6">
          <div className="flex gap-2 mb-4">
            <form
              className="flex gap-2 flex-1"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!text.trim()) return;
                await addTodo({ text });
                setText("");
              }}
            >
              <input
                className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-400/50"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Bạn cần làm gì hôm nay?"
              />
              <button
                className="rounded-xl bg-black text-white px-4 py-2 font-medium shadow-sm hover:bg-zinc-800 active:bg-zinc-900 transition"
                type="submit"
              >
                Thêm
              </button>
            </form>
            <input
              className="w-48 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-400/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex rounded-xl border border-zinc-200 p-1 bg-white">
              {(["all", "active", "completed"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition ${
                    filter === key ? "bg-black text-white" : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {key === "all" && "Tất cả"}
                  {key === "active" && "Đang làm"}
                  {key === "completed" && "Đã xong"}
                </button>
              ))}
            </div>
            <span className="ml-1 text-sm text-zinc-500">
              {activeCount} đang làm · {completedCount} đã xong
            </span>
            <div className="ml-auto">
              <button
                className="text-sm px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 transition"
                onClick={() => {
                  // Clear completed todos
                  const completedTodos = todos?.filter(todo => todo.completed) || [];
                  completedTodos.forEach(todo => deleteTodo({ id: todo._id }));
                }}
              >
                Xóa mục đã hoàn thành
              </button>
            </div>
          </div>

          {todos === undefined ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-11 rounded-xl bg-zinc-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-zinc-500">
              <div className="text-4xl mb-2">🗒️</div>
              <p>Chưa có công việc nào. Hãy thêm mục mới ở phía trên nhé!</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {filtered.map((todo: any) => (
                <li
                  key={todo._id}
                  className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:shadow transition"
                >
                  <input
                    aria-label="Đánh dấu hoàn thành"
                    className="h-5 w-5 accent-black cursor-pointer"
                    type="checkbox"
                    checked={!!todo.completed}
                    onChange={() => updateTodo({ id: todo._id, completed: !todo.completed })}
                  />

                  {editingId === todo._id ? (
                    <form
                      className="flex-1 flex gap-2"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (editingText.trim()) await updateTodo({ id: todo._id, text: editingText });
                        setEditingId(null);
                        setEditingText("");
                      }}
                    >
                      <input
                        className="flex-1 rounded-lg border border-zinc-200 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-zinc-400/50"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        autoFocus
                      />
                      <button className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100" type="submit">
                        Lưu
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100"
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditingText("");
                        }}
                      >
                        Hủy
                      </button>
                    </form>
                  ) : (
                    <>
                      <span className={`flex-1 text-zinc-800 ${todo.completed ? "line-through text-zinc-400" : ""}`}>
                        {todo.text}
                      </span>
                      {/* Priority selector */}
                      <select
                        className="text-sm rounded-lg border border-zinc-200 px-2 py-1 bg-white"
                        value={todo.priority || "medium"}
                        onChange={(e) => updateTodo({ id: todo._id, priority: e.target.value })}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      {/* Due date */}
                      <input
                        type="date"
                        className="text-sm rounded-lg border border-zinc-200 px-2 py-1 bg-white"
                        value={todo.dueDate ? formatDateForInput(todo.dueDate) : ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (!v) return updateTodo({ id: todo._id, dueDate: undefined });
                          const ts = new Date(v + "T00:00:00").getTime();
                          updateTodo({ id: todo._id, dueDate: ts });
                        }}
                      />
                      {todo.dueDate && Date.now() > todo.dueDate && !todo.completed && (
                        <span className="text-xs text-red-600">Quá hạn</span>
                      )}
                      <button
                        className="opacity-0 group-hover:opacity-100 transition px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100"
                        onClick={() => {
                          setEditingId(todo._id);
                          setEditingText(todo.text);
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        className="opacity-0 group-hover:opacity-100 transition px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-red-50 text-red-600"
                        onClick={() => deleteTodo({ id: todo._id })}
                      >
                        Xóa
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
