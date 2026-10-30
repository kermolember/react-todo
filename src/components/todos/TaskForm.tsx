import { useState } from 'react'
import { toIsoFromDateTime, toLocalDateTimeFields } from '@/lib/date'
import type { TodoCategory, TodoPriority, TodoTask, TodoTaskCreate } from '@/types/api'

type EditableTask = TodoTask & { dueDate: string; dueTime: string }

export default function TaskForm({
  mode,
  categories,
  priorities,
  initial,
  loading,
  onSubmit,
  onCancel,
}: {
  mode: 'create' | 'edit'
  categories: TodoCategory[]
  priorities: TodoPriority[]
  initial?: EditableTask
  loading: boolean
  onSubmit: (value: TodoTaskCreate | TodoTask) => Promise<void>
  onCancel: () => void
}) {
  const [taskName, setTaskName] = useState(initial?.taskName ?? '')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')
  const [dueTime, setDueTime] = useState(initial?.dueTime ?? '23:59')
  const [isCompleted, setIsCompleted] = useState(initial?.isCompleted ?? false)
  const [todoCategoryId, setTodoCategoryId] = useState(initial?.todoCategoryId ?? '')
  const [todoPriorityId, setTodoPriorityId] = useState(initial?.todoPriorityId ?? '')

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const dueDt = toIsoFromDateTime(dueDate, dueTime)
    if (mode === 'edit' && initial) {
      await onSubmit({
        id: initial.id,
        taskName,
        taskSort: initial.taskSort,
        createdDt: initial.createdDt,
        dueDt,
        isCompleted,
        isArchived: false,
        todoCategoryId,
        todoPriorityId,
        syncDt: initial.syncDt,
      })
      return
    }

    await onSubmit({
      taskName,
      taskSort: 0,
      createdDt: new Date().toISOString(),
      dueDt,
      isCompleted,
      isArchived: false,
      todoCategoryId,
      todoPriorityId,
    })
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label htmlFor="taskName">Task Name:</label>
        <input
          id="taskName"
          value={taskName ?? ''}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="dueDate">Due Date:</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="dueTime">Due Time:</label>
        <input
          id="dueTime"
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="isCompleted">Completed:</label>
        <input
          id="isCompleted"
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
        />
      </div>
      <div>
        <label htmlFor="todoCategoryId">Category:</label>
        <select
          id="todoCategoryId"
          value={todoCategoryId}
          onChange={(e) => setTodoCategoryId(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.categoryName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="todoPriorityId">Priority:</label>
        <select
          id="todoPriorityId"
          value={todoPriorityId}
          onChange={(e) => setTodoPriorityId(e.target.value)}
          required
        >
          <option value="">Select Priority</option>
          {priorities.map((priority) => (
            <option key={priority.id} value={priority.id}>
              {priority.priorityName}
            </option>
          ))}
        </select>
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

export function toEditableTask(task: TodoTask): EditableTask {
  if (!task.dueDt) {
    return { ...task, dueDate: '', dueTime: '23:59' }
  }
  return { ...task, ...toLocalDateTimeFields(task.dueDt) }
}
