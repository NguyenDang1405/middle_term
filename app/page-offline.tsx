'use client'

import { useState } from 'react'
import { Plus, Check, Trash2, Edit3, BarChart3, Target } from 'lucide-react'

// Mock data để test offline
const mockTodos = [
  {
    _id: '1',
    text: 'Học Next.js và Convex',
    completed: false,
    createdAt: Date.now(),
    priority: 'high',
    category: 'learning',
    dueDate: Date.now() + 86400000
  },
  {
    _id: '2', 
    text: 'Tạo ứng dụng Todo App',
    completed: true,
    createdAt: Date.now() - 86400000,
    priority: 'medium',
    category: 'work',
    dueDate: Date.now()
  },
  {
    _id: '3',
    text: 'Thiết kế giao diện responsive',
    completed: false,
    createdAt: Date.now() - 172800000,
    priority: 'high',
    category: 'work',
    dueDate: Date.now() + 259200000
  }
]

export default function OfflinePage() {
  const [todos, setTodos] = useState(mockTodos)
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('general')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  const handleAddTodo = () => {
    if (text.trim()) {
      const newTodo = {
        _id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        createdAt: Date.now(),
        priority,
        category,
        dueDate: undefined
      }
      setTodos([newTodo, ...todos])
      setText('')
      setPriority('medium')
      setCategory('general')
    }
  }

  const handleToggleComplete = (id: string) => {
    setTodos(todos.map(todo => 
      todo._id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo._id !== id))
  }

  const handleEdit = (id: string) => {
    const todo = todos.find(t => t._id === id)
    if (todo) {
      setEditingId(id)
      setEditingText(todo.text)
    }
  }

  const handleUpdateTodo = () => {
    if (editingText.trim()) {
      setTodos(todos.map(todo => 
        todo._id === editingId ? { ...todo, text: editingText.trim() } : todo
      ))
      setEditingId(null)
      setEditingText('')
    }
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Cloud Todo App</h1>
                <p className="text-sm text-gray-500">Offline Mode - Demo</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                <div className="text-sm text-gray-500">Tổng công việc</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <div className="text-sm text-gray-500">Đã hoàn thành</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{totalCount - completedCount}</div>
                <div className="text-sm text-gray-500">Đang làm</div>
              </div>
            </div>
          </div>

          {/* Add Todo Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm công việc mới</h3>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Nhập công việc cần làm..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mức độ ưu tiên
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">Chung</option>
                    <option value="work">Công việc</option>
                    <option value="personal">Cá nhân</option>
                    <option value="health">Sức khỏe</option>
                    <option value="learning">Học tập</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleAddTodo}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm công việc</span>
              </button>
            </div>
          </div>

          {/* Todo List */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh sách công việc</h3>
            {todos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📝</div>
                <p>Chưa có công việc nào. Hãy thêm mục mới ở phía trên!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo._id}
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <button
                      onClick={() => handleToggleComplete(todo._id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        todo.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {todo.completed && <Check className="w-3 h-3" />}
                    </button>

                    {editingId === todo._id ? (
                      <div className="flex-1 flex space-x-2">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={handleUpdateTodo}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null)
                            setEditingText('')
                          }}
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {todo.text}
                          </span>
                          <div className="flex space-x-2 mt-1">
                            <span className={`px-2 py-1 text-xs rounded ${
                              todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                              todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {todo.priority === 'high' ? 'Cao' : todo.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                            </span>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {todo.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(todo._id)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTodo(todo._id)}
                            className="p-1 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
