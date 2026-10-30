'use client'

import { useEffect, useState } from 'react'
import AuthGuard from '@/components/auth/AuthGuard'
import AppShell from '@/components/layout/AppShell'
import PriorityForm from '@/components/todos/PriorityForm'
import PriorityList from '@/components/todos/PriorityList'
import { useAuth } from '@/hooks/useAuth'
import { useTodos } from '@/hooks/useTodos'
import type { TodoPriority, TodoPriorityCreate } from '@/types/api'

export default function PrioritiesPage() {
  const { isHydrated, isAuthenticated } = useAuth()
  const { priorities, fetchPriorities, createPriority, updatePriority, deletePriority } = useTodos()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPriority, setEditingPriority] = useState<TodoPriority | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return
    fetchPriorities().catch((err) =>
      setError(err instanceof Error ? err.message : 'Failed to load priorities'),
    )
  }, [isHydrated, isAuthenticated, fetchPriorities])

  return (
    <AuthGuard>
      <AppShell>
        <div className="priorities-view">
          <h1>Todo Priorities</h1>
          <button className="create-btn" onClick={() => setShowCreateForm(true)}>
            Add Priority
          </button>
          {showCreateForm ? (
            <div className="form-overlay">
              <div className="form-container">
                <h2>Create Priority</h2>
                <PriorityForm
                  mode="create"
                  loading={loading}
                  onSubmit={async (value) => {
                    setLoading(true)
                    setError('')
                    try {
                      await createPriority(value as TodoPriorityCreate)
                      setShowCreateForm(false)
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Failed to create priority')
                    } finally {
                      setLoading(false)
                    }
                  }}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            </div>
          ) : null}
          {editingPriority ? (
            <div className="form-overlay">
              <div className="form-container">
                <h2>Edit Priority</h2>
                <PriorityForm
                  mode="edit"
                  initial={editingPriority}
                  loading={loading}
                  onSubmit={async (value) => {
                    setLoading(true)
                    setError('')
                    try {
                      await updatePriority(editingPriority.id, value as TodoPriority)
                      setEditingPriority(null)
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Failed to update priority')
                    } finally {
                      setLoading(false)
                    }
                  }}
                  onCancel={() => setEditingPriority(null)}
                />
              </div>
            </div>
          ) : null}
          <PriorityList
            priorities={priorities}
            onEdit={(item) => setEditingPriority({ ...item })}
            onDelete={async (id) => {
              if (!confirm('Are you sure you want to delete this priority?')) return
              setLoading(true)
              setError('')
              try {
                await deletePriority(id)
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete priority')
              } finally {
                setLoading(false)
              }
            }}
          />
          {error ? <p className="error">{error}</p> : null}
        </div>
      </AppShell>
    </AuthGuard>
  )
}
