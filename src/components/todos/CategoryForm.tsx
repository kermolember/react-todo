import { useState } from 'react'
import type { TodoCategory, TodoCategoryCreate } from '@/types/api'

export default function CategoryForm({
  mode,
  initial,
  loading,
  onSubmit,
  onCancel,
}: {
  mode: 'create' | 'edit'
  initial?: TodoCategory | TodoCategoryCreate
  loading: boolean
  onSubmit: (value: TodoCategory | TodoCategoryCreate) => Promise<void>
  onCancel: () => void
}) {
  const [categoryName, setCategoryName] = useState(initial?.categoryName ?? '')

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (mode === 'edit' && initial && 'id' in initial) {
      await onSubmit({
        id: initial.id,
        categoryName,
        categorySort: initial.categorySort,
        syncDt: initial.syncDt,
      })
      return
    }
    await onSubmit({ categoryName, categorySort: 0 })
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label htmlFor="categoryName">Category Name:</label>
        <input
          id="categoryName"
          required
          value={categoryName ?? ''}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </div>
      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {mode === 'create' ? 'Create' : 'Update'}
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
