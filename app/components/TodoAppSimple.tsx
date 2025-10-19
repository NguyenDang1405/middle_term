'use client'

import { useState } from 'react'
import { Plus, Check, Trash2, Edit3, BarChart3, Target } from 'lucide-react'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
import StatsPanel from './StatsPanel'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
  priority?: string
  category?: string
}

export default function TodoAppSimple() {
  const [activeTab, setActiveTab] = useState<'todos' | 'stats'>('todos')
  const [editingTodo, setEditingTodo] = useState<string | null>(null)
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      text: 'Học Next.js và Convex',
      completed: false,
      createdAt: Date.now(),
      priority: 'high',
      category: 'learning'
    },
    {
      id: '2',
      text: 'Tạo ứng dụng Todo App',
      completed: true,
      createdAt: Date.now() - 86400000,
      priority: 'medium',
      category: 'work'
    }
  ])

  const handleAddTodo = (text: string, priority: string, category: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
      priority,
      category
    }
    setTodos([newTodo, ...todos])
  }

  const handleUpdateTodo = (id: string, text: string, priority: string, category: string) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, text, priority, category }
        : todo
    ))
    setEditingTodo(null)
  }

  const handleToggleComplete = (id: string, completed: boolean) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed }
        : todo
    ))
  }

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  // Convert todos to the format expected by TodoList
  const todosForList = todos.map(todo => ({
    _id: todo.id as any,
    text: todo.text,
    completed: todo.completed,
    createdAt: todo.createdAt,
    priority: todo.priority,
    category: todo.category
  }))

  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    pending: todos.filter(todo => !todo.completed).length,
    completionRate: todos.length > 0 ? Math.round((todos.filter(todo => todo.completed).length / todos.length) * 100) : 0,
    byPriority: todos.reduce((acc, todo) => {
      acc[todo.priority || 'medium'] = (acc[todo.priority || 'medium'] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    byCategory: todos.reduce((acc, todo) => {
      acc[todo.category || 'general'] = (acc[todo.category || 'general'] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Cloud Todo App</h1>
                <p className="text-sm text-gray-500">Quản lý công việc thông minh</p>
              </div>
            </div>
            
            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab('todos')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'todos'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>Công việc</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'stats'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Thống kê</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'todos' ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quản lý công việc của bạn
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tổ chức, theo dõi và hoàn thành mọi công việc một cách hiệu quả
              </p>
            </div>

            {/* Todo Form */}
            <div className="max-w-2xl mx-auto">
              <TodoForm
                onSubmit={handleAddTodo}
                editingTodo={editingTodo}
                onUpdate={handleUpdateTodo}
                onCancel={() => setEditingTodo(null)}
              />
            </div>

            {/* Todo List */}
            <div className="max-w-4xl mx-auto">
              <TodoList
                todos={todosForList}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTodo}
                onEdit={setEditingTodo}
                editingTodo={editingTodo}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Thống kê công việc
              </h2>
              <p className="text-lg text-gray-600">
                Theo dõi tiến độ và hiệu suất làm việc của bạn
              </p>
            </div>
            
            <StatsPanel stats={stats} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 Cloud Todo App - Được xây dựng với Next.js, Convex và Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
