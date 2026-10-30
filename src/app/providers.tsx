'use client'

import { AuthProvider } from '@/context/AuthContext'
import { TodoProvider } from '@/context/TodoContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TodoProvider>{children}</TodoProvider>
    </AuthProvider>
  )
}
