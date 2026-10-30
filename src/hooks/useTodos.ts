'use client'

import { useContext } from 'react'
import { TodoContext } from '@/context/TodoContext'

export function useTodos() {
  const value = useContext(TodoContext)
  if (!value) throw new Error('useTodos must be used within TodoProvider')
  return value
}
