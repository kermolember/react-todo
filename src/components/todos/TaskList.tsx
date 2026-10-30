import { formatDueDate } from '@/lib/date'
import type { TodoCategory, TodoPriority, TodoTask } from '@/types/api'

export default function TaskList({
  tasks,
  categories,
  priorities,
  compact = false,
  onToggleComplete,
  onEdit,
  onDelete,
}: {
  tasks: TodoTask[]
  categories: TodoCategory[]
  priorities: TodoPriority[]
  compact?: boolean
  onToggleComplete?: (task: TodoTask) => void
  onEdit?: (task: TodoTask) => void
  onDelete?: (task: TodoTask) => void
}) {
  const getCategoryName = (id: string) =>
    categories.find((item) => item.id === id)?.categoryName ?? 'Unknown'
  const getPriorityName = (id: string) =>
    priorities.find((item) => item.id === id)?.priorityName ?? 'Unknown'

  if (compact) {
    return (
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
            <span>{task.taskName}</span>
            <span className="attributes">
              Priority: {getPriorityName(task.todoPriorityId)} | Category:{' '}
              {getCategoryName(task.todoCategoryId)} |{' '}
              {task.dueDt ? `Due: ${formatDueDate(task.dueDt)}` : ''}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="list">
      {tasks.map((task) => (
        <div key={task.id} className={`list-item ${task.isCompleted ? 'completed' : ''}`}>
          <div className="item-info">
            <h3>{task.taskName}</h3>
            <p>Created: {new Date(task.createdDt).toLocaleString()}</p>
            {task.dueDt ? <p>Due: {formatDueDate(task.dueDt)}</p> : null}
            <p>Category: {getCategoryName(task.todoCategoryId)}</p>
            <p>Priority: {getPriorityName(task.todoPriorityId)}</p>
          </div>
          <div className="item-actions">
            {onToggleComplete ? (
              <button
                onClick={() => onToggleComplete(task)}
                className={task.isCompleted ? 'incomplete-btn' : 'complete-btn'}
              >
                {task.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
            ) : null}
            {onEdit ? <button onClick={() => onEdit(task)}>Edit</button> : null}
            {onDelete ? (
              <button className="delete-btn" onClick={() => onDelete(task)}>
                Delete
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}
