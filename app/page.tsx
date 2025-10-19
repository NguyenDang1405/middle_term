import TodoApp from './components/TodoApp'
import OfflinePage from './page-offline'

export default function Home() {
  // Kiểm tra xem có Convex URL không
  const hasConvexUrl = process.env.NEXT_PUBLIC_CONVEX_URL && 
    process.env.NEXT_PUBLIC_CONVEX_URL !== 'https://offline-mode.convex.cloud'
  
  if (!hasConvexUrl) {
    return <OfflinePage />
  }
  
  return <TodoApp />
}
