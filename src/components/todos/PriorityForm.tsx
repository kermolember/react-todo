import { useState } from 'react'
import type { TodoPriority, TodoPriorityCreate } from '@/types/api'

export default function PriorityForm({
  mode,
  initial,
  loading,
  onSubmit,
  onCancel,
}: {
  mode: 'create' | 'edit'
  initial?: TodoPriority | TodoPriorityCreate
  loading: boolean
  onSubmit: (value: TodoPriority | TodoPriorityCreate) => Promise<void>
  onCancel: () => void
}) {
  const [priorityName, setPriorityName] = useState(initial?.priorityName ?? '')

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (mode === 'edit' && initial && 'id' in initial) {
      await onSubmit({ ...initial, priorityName })
      return
    }
    await onSubmit({ priorityName, prioritySort: 0, syncDt: new Date().toISOString() })
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label htmlFor="priorityName">Priority Name:</label>
        <input
          id="priorityName"
          required
          value={priorityName ?? ''}
          onChange={(e) => setPriorityName(e.target.value)}
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
