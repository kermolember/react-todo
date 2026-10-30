'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isHydrated, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isHydrated) return
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isHydrated, isAuthenticated, router])

  if (!isHydrated) return <p>Loading...</p>
  if (!isAuthenticated) return <p>Redirecting...</p>
  return <>{children}</>
}
