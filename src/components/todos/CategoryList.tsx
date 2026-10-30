import type { TodoCategory } from '@/types/api'

export default function CategoryList({
  categories,
  onEdit,
  onDelete,
}: {
  categories: TodoCategory[]
  onEdit: (category: TodoCategory) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="list">
      {categories.map((category) => (
        <div key={category.id} className="list-item">
          <div className="item-info">
            <h3>{category.categoryName}</h3>
          </div>
          <div className="item-actions">
            <button onClick={() => onEdit(category)}>Edit</button>
            <button onClick={() => onDelete(category.id)} className="delete-btn">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
