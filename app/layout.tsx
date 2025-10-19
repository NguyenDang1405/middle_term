import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ConvexClientProvider from './providers/ConvexProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cloud Todo App - Quản lý công việc thông minh',
  description: 'Ứng dụng quản lý công việc với giao diện đẹp và thống kê chi tiết',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ConvexClientProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {children}
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
