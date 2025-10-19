'use client'

import { useState } from 'react'
import { Id } from '../../../convex/_generated/dataModel'
import { Plus, X } from 'lucide-react'

interface TodoFormProps {
  onSubmit: (text: string, priority: string, category: string) => void
  editingTodo?: Id<'todos'> | null
  onUpdate?: (id: Id<'todos'>, text: string, priority: string, category: string) => void
  onCancel?: () => void
}

export default function TodoForm({ onSubmit, editingTodo, onUpdate, onCancel }: TodoFormProps) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('general')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      if (editingTodo && onUpdate) {
        onUpdate(editingTodo, text.trim(), priority, category)
      } else {
        onSubmit(text.trim(), priority, category)
      }
      setText('')
      setPriority('medium')
      setCategory('general')
    }
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {editingTodo ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập công việc cần làm..."
            className="input-field"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mức độ ưu tiên
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="input-field"
            >
              <option value="low">Thấp</option>
              <option value="medium">Trung bình</option>
              <option value="high">Cao</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
            >
              <option value="general">Chung</option>
              <option value="work">Công việc</option>
              <option value="personal">Cá nhân</option>
              <option value="health">Sức khỏe</option>
              <option value="learning">Học tập</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          {editingTodo && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Hủy</span>
            </button>
          )}
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{editingTodo ? 'Cập nhật' : 'Thêm mới'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
