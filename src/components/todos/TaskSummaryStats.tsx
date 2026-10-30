import type { TodoCategory, TodoPriority, TodoTask } from '@/types/api'

export default function TaskSummaryStats({
  categories,
  priorities,
  tasks,
  completedTasks,
}: {
  categories: TodoCategory[]
  priorities: TodoPriority[]
  tasks: TodoTask[]
  completedTasks: number
}) {
  return (
    <div className="stats">
      <div className="stat">
        <h3>{categories.length}</h3>
        <p>Categories</p>
      </div>
      <div className="stat">
        <h3>{priorities.length}</h3>
        <p>Priorities</p>
      </div>
      <div className="stat">
        <h3>{tasks.length}</h3>
        <p>Tasks</p>
      </div>
      <div className="stat">
        <h3>{completedTasks}</h3>
        <p>Completed</p>
      </div>
    </div>
  )
}
