'use client'

import { Id } from '../../convex/_generated/dataModel'
import { Check, Trash2, Edit3, Clock, AlertCircle, CheckCircle } from 'lucide-react'

interface Todo {
  _id: Id<'todos'>
  text: string
  completed: boolean
  createdAt: number
  priority?: string
  category?: string
}

interface TodoListProps {
  todos: Todo[]
  onToggleComplete: (id: Id<'todos'>, completed: boolean) => void
  onDelete: (id: Id<'todos'>) => void
  onEdit: (id: Id<'todos'>) => void
  editingTodo?: Id<'todos'> | null
}

export default function TodoList({ todos, onToggleComplete, onDelete, onEdit, editingTodo }: TodoListProps) {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />
      case 'medium':
        return <Clock className="w-4 h-4" />
      case 'low':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'work':
        return 'bg-blue-100 text-blue-800'
      case 'personal':
        return 'bg-purple-100 text-purple-800'
      case 'health':
        return 'bg-green-100 text-green-800'
      case 'learning':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Check className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có công việc nào</h3>
        <p className="text-gray-500">Hãy thêm công việc đầu tiên của bạn!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Danh sách công việc ({todos.length})
        </h3>
      </div>

      <div className="grid gap-4">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className={`card transition-all duration-200 hover:shadow-xl ${
              todo.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              <button
                onClick={() => onToggleComplete(todo._id, !todo.completed)}
                className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  todo.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 hover:border-green-500'
                }`}
              >
                {todo.completed && <Check className="w-4 h-4" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p
                      className={`text-lg font-medium ${
                        todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}
                    >
                      {todo.text}
                    </p>
                    
                    <div className="flex items-center space-x-3 mt-2">
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          todo.priority
                        )}`}
                      >
                        {getPriorityIcon(todo.priority)}
                        <span>
                          {todo.priority === 'high' ? 'Cao' : 
                           todo.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                        </span>
                      </span>
                      
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          todo.category
                        )}`}
                      >
                        {todo.category === 'work' ? 'Công việc' :
                         todo.category === 'personal' ? 'Cá nhân' :
                         todo.category === 'health' ? 'Sức khỏe' :
                         todo.category === 'learning' ? 'Học tập' : 'Chung'}
                      </span>
                      
                      <span className="text-xs text-gray-500">
                        {new Date(todo.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onEdit(todo._id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(todo._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
