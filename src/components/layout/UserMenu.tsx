'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function UserMenu() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const onLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <div className="user-info">
      {user ? (
        <span>
          Welcome, {user.firstName} {user.lastName}
        </span>
      ) : null}
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}
