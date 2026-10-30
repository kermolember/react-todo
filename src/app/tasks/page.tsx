'use client'

import { useEffect, useState } from 'react'
import AuthGuard from '@/components/auth/AuthGuard'
import AppShell from '@/components/layout/AppShell'
import TaskForm, { toEditableTask } from '@/components/todos/TaskForm'
import TaskList from '@/components/todos/TaskList'
import { useAuth } from '@/hooks/useAuth'
import { useTodos } from '@/hooks/useTodos'
import type { TodoTask, TodoTaskCreate } from '@/types/api'

export default function TasksPage() {
  const { isHydrated, isAuthenticated } = useAuth()
  const {
    categories,
    priorities,
    tasks,
    fetchCategories,
    fetchPriorities,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTodos()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTask, setEditingTask] = useState<ReturnType<typeof toEditableTask> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return
    Promise.all([fetchCategories(), fetchPriorities(), fetchTasks()]).catch((err) =>
      setError(err instanceof Error ? err.message : 'Failed to load data'),
    )
  }, [isHydrated, isAuthenticated, fetchCategories, fetchPriorities, fetchTasks])

  const toggleComplete = async (task: TodoTask) => {
    const isCompleting = !task.isCompleted
    const updated = { ...task, isCompleted: isCompleting }
    if (isCompleting) {
      updated.syncDt = new Date().toISOString()
    }
    try {
      await updateTask(task.id, updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    }
  }

  return (
    <AuthGuard>
      <AppShell>
        <div className="tasks-view">
          <h1>Todo Tasks</h1>
          <button className="create-btn" onClick={() => setShowCreateForm(true)}>
            Add Task
          </button>
          {showCreateForm ? (
            <div className="form-overlay">
              <div className="form-container">
                <h2>Create Task</h2>
                <TaskForm
                  mode="create"
                  categories={categories}
                  priorities={priorities}
                  loading={loading}
                  onSubmit={async (value) => {
                    setLoading(true)
                    setError('')
                    try {
                      await createTask(value as TodoTaskCreate)
                      setShowCreateForm(false)
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Failed to create task')
                    } finally {
                      setLoading(false)
                    }
                  }}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            </div>
          ) : null}
          {editingTask ? (
            <div className="form-overlay">
              <div className="form-container">
                <h2>Edit Task</h2>
                <TaskForm
                  mode="edit"
                  initial={editingTask}
                  categories={categories}
                  priorities={priorities}
                  loading={loading}
                  onSubmit={async (value) => {
                    setLoading(true)
                    setError('')
                    try {
                      await updateTask(editingTask.id, value as TodoTask)
                      setEditingTask(null)
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Failed to update task')
                    } finally {
                      setLoading(false)
                    }
                  }}
                  onCancel={() => setEditingTask(null)}
                />
              </div>
            </div>
          ) : null}
          <TaskList
            tasks={tasks}
            categories={categories}
            priorities={priorities}
            onToggleComplete={toggleComplete}
            onEdit={(task) => setEditingTask(toEditableTask(task))}
            onDelete={async (task) => {
              if (!confirm('Are you sure you want to delete this task?')) return
              setLoading(true)
              setError('')
              try {
                await deleteTask(task.id)
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete task')
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
