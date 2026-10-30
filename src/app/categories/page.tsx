'use client'

import { useEffect, useState } from 'react'
import AuthGuard from '@/components/auth/AuthGuard'
import AppShell from '@/components/layout/AppShell'
import CategoryForm from '@/components/todos/CategoryForm'
import CategoryList from '@/components/todos/CategoryList'
import { useAuth } from '@/hooks/useAuth'
import { useTodos } from '@/hooks/useTodos'
import type { TodoCategory, TodoCategoryCreate } from '@/types/api'

export default function CategoriesPage() {
  const { isHydrated, isAuthenticated } = useAuth()
  const { categories, fetchCategories, createCategory, updateCategory, deleteCategory } = useTodos()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<TodoCategory | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return
    fetchCategories().catch((err) =>
      setError(err instanceof Error ? err.message : 'Failed to load categories'),
    )
  }, [isHydrated, isAuthenticated, fetchCategories])

  return (
    <AuthGuard>
      <AppShell>
        <div className="categories-view">
          <h1>Todo Categories</h1>
          <button className="create-btn" onClick={() => setShowCreateForm(true)}>
            Add Category
          </button>
          {showCreateForm ? (
            <div className="form-overlay">
              <div className="form-container">
                <h2>Create Category</h2>
                <CategoryForm
                  mode="create"
                  loading={loading}
                  onSubmit={async (value) => {
                    setLoading(true)
                    setError('')
                    try {
                      await createCategory(value as TodoCategoryCreate)
                      setShowCreateForm(false)
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Failed to create category')
                    } finally {
                      setLoading(false)
                    }
                  }}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            </div>
          ) : null}
          {editingCategory ? (
            <div className="form-overlay">
              <div className="form-container">
                <h2>Edit Category</h2>
                <CategoryForm
                  mode="edit"
                  initial={editingCategory}
                  loading={loading}
                  onSubmit={async (value) => {
                    setLoading(true)
                    setError('')
                    try {
                      await updateCategory(editingCategory.id, value as TodoCategory)
                      setEditingCategory(null)
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Failed to update category')
                    } finally {
                      setLoading(false)
                    }
                  }}
                  onCancel={() => setEditingCategory(null)}
                />
              </div>
            </div>
          ) : null}
          <CategoryList
            categories={categories}
            onEdit={(item) => setEditingCategory({ ...item })}
            onDelete={async (id) => {
              if (!confirm('Are you sure you want to delete this category?')) return
              setLoading(true)
              setError('')
              try {
                await deleteCategory(id)
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete category')
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
