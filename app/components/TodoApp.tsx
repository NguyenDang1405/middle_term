'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { Plus, Check, Trash2, Edit3, BarChart3, Calendar, Target, TrendingUp } from 'lucide-react'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
import StatsPanel from './StatsPanel'

export default function TodoApp() {
  const [activeTab, setActiveTab] = useState<'todos' | 'stats'>('todos')
  const [editingTodo, setEditingTodo] = useState<Id<'todos'> | null>(null)

  const todos = useQuery(api.todos.getTodos) || []
  const stats = useQuery(api.todos.getStats)

  const addTodo = useMutation(api.todos.addTodo)
  const updateTodo = useMutation(api.todos.updateTodo)
  const deleteTodo = useMutation(api.todos.deleteTodo)

  const handleAddTodo = async (text: string, priority: string, category: string) => {
    await addTodo({ text, priority, category })
  }

  const handleUpdateTodo = async (id: Id<'todos'>, text: string, priority: string, category: string) => {
    await updateTodo({ id, text, priority, category })
    setEditingTodo(null)
  }

  const handleToggleComplete = async (id: Id<'todos'>, completed: boolean) => {
    await updateTodo({ id, completed })
  }

  const handleDeleteTodo = async (id: Id<'todos'>) => {
    await deleteTodo({ id })
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
                todos={todos}
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
            
            {stats && <StatsPanel stats={stats} />}
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
