'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    const token = sessionStorage.getItem('auth_token')
    router.replace(token ? '/' : '/login')
  }, [router])

  return <p>Redirecting...</p>
}
