import type { TodoTask } from '@/types/api'

export function sortTasks(items: TodoTask[]): TodoTask[] {
  return [...items].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1
    }
    if (a.isCompleted) {
      return new Date(b.syncDt).getTime() - new Date(a.syncDt).getTime()
    }
    return 0
  })
}
