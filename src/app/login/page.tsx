'use client'

import PublicOnlyRoute from '@/components/auth/PublicOnlyRoute'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <PublicOnlyRoute>
      <LoginForm />
    </PublicOnlyRoute>
  )
}
