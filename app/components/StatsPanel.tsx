'use client'

import { BarChart3, CheckCircle, Clock, Target, TrendingUp, Calendar, Award } from 'lucide-react'

interface Stats {
  total: number
  completed: number
  pending: number
  completionRate: number
  byPriority: Record<string, number>
  byCategory: Record<string, number>
}

interface StatsPanelProps {
  stats: Stats
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const priorityLabels = {
    high: 'Cao',
    medium: 'Trung bình',
    low: 'Thấp'
  }

  const categoryLabels = {
    work: 'Công việc',
    personal: 'Cá nhân',
    health: 'Sức khỏe',
    learning: 'Học tập',
    general: 'Chung'
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</h3>
          <p className="text-gray-600">Tổng công việc</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.completed}</h3>
          <p className="text-gray-600">Đã hoàn thành</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.pending}</h3>
          <p className="text-gray-600">Đang chờ</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.completionRate}%</h3>
          <p className="text-gray-600">Tỷ lệ hoàn thành</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Priority Distribution */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Phân bố theo mức độ</h3>
              <p className="text-sm text-gray-600">Công việc theo độ ưu tiên</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(stats.byPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      priority === 'high'
                        ? 'bg-red-500'
                        : priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {priorityLabels[priority as keyof typeof priorityLabels]}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        priority === 'high'
                          ? 'bg-red-500'
                          : priority === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{
                        width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Phân bố theo danh mục</h3>
              <p className="text-sm text-gray-600">Công việc theo loại</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      category === 'work'
                        ? 'bg-blue-500'
                        : category === 'personal'
                        ? 'bg-purple-500'
                        : category === 'health'
                        ? 'bg-green-500'
                        : category === 'learning'
                        ? 'bg-orange-500'
                        : 'bg-gray-500'
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        category === 'work'
                          ? 'bg-blue-500'
                          : category === 'personal'
                          ? 'bg-purple-500'
                          : category === 'health'
                          ? 'bg-green-500'
                          : category === 'learning'
                          ? 'bg-orange-500'
                          : 'bg-gray-500'
                      }`}
                      style={{
                        width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement */}
      {stats.completionRate >= 80 && (
        <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">
                🎉 Chúc mừng! Bạn đang làm rất tốt!
              </h3>
              <p className="text-yellow-700">
                Tỷ lệ hoàn thành công việc của bạn là {stats.completionRate}% - 
                {stats.completionRate >= 90 ? ' Xuất sắc!' : ' Tuyệt vời!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
