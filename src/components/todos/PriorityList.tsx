import type { TodoPriority } from '@/types/api'

export default function PriorityList({
  priorities,
  onEdit,
  onDelete,
}: {
  priorities: TodoPriority[]
  onEdit: (priority: TodoPriority) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="list">
      {priorities.map((priority) => (
        <div key={priority.id} className="list-item">
          <div className="item-info">
            <h3>{priority.priorityName}</h3>
          </div>
          <div className="item-actions">
            <button onClick={() => onEdit(priority)}>Edit</button>
            <button onClick={() => onDelete(priority.id)} className="delete-btn">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
