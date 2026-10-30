import type { TodoCategory, TodoPriority } from '@/types/api'

export default function TaskFilters({
  priorities,
  categories,
  priorityFilter,
  categoryFilter,
  onPriorityChange,
  onCategoryChange,
  priorityId = 'priorityFilter',
  categoryId = 'categoryFilter',
}: {
  priorities: TodoPriority[]
  categories: TodoCategory[]
  priorityFilter: string
  categoryFilter: string
  onPriorityChange: (value: string) => void
  onCategoryChange: (value: string) => void
  priorityId?: string
  categoryId?: string
}) {
  return (
    <div className="filter-controls">
      <label htmlFor={priorityId}>Filter by Priority:</label>
      <select
        id={priorityId}
        value={priorityFilter}
        onChange={(e) => onPriorityChange(e.target.value)}
      >
        <option value="">All</option>
        {priorities.map((priority) => (
          <option key={priority.id} value={priority.id}>
            {priority.priorityName}
          </option>
        ))}
      </select>
      <span>&nbsp;&nbsp;</span>
      <label htmlFor={categoryId}>Filter by Category:</label>
      <select
        id={categoryId}
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">All</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.categoryName}
          </option>
        ))}
      </select>
    </div>
  )
}
