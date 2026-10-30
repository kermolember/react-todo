'use client'

import PublicOnlyRoute from '@/components/auth/PublicOnlyRoute'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <PublicOnlyRoute>
      <RegisterForm />
    </PublicOnlyRoute>
  )
}
