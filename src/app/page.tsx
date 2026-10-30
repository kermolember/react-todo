'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import AuthGuard from '@/components/auth/AuthGuard'
import AppShell from '@/components/layout/AppShell'
import TaskFilters from '@/components/todos/TaskFilters'
import TaskList from '@/components/todos/TaskList'
import TaskSummaryStats from '@/components/todos/TaskSummaryStats'
import { useAuth } from '@/hooks/useAuth'
import { useTodos } from '@/hooks/useTodos'

export default function DashboardPage() {
  const { isHydrated, isAuthenticated } = useAuth()
  const { categories, priorities, tasks, fetchCategories, fetchPriorities, fetchTasks } = useTodos()
  const [priorityFilter, setPriorityFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return
    Promise.all([fetchCategories(), fetchPriorities(), fetchTasks()]).catch(() => undefined)
  }, [isHydrated, isAuthenticated, fetchCategories, fetchPriorities, fetchTasks])

  const filteredTasks = useMemo(() => {
    let next = tasks
    if (priorityFilter) next = next.filter((item) => item.todoPriorityId === priorityFilter)
    if (categoryFilter) next = next.filter((item) => item.todoCategoryId === categoryFilter)
    return next
  }, [tasks, priorityFilter, categoryFilter])

  const completedTasks = filteredTasks.filter((task) => task.isCompleted).length

  return (
    <AuthGuard>
      <AppShell>
        <h2>Quick Overview</h2>
        <TaskSummaryStats
          categories={categories}
          priorities={priorities}
          tasks={tasks}
          completedTasks={completedTasks}
        />
        <h2>Tasks</h2>
        {tasks.length === 0 ? (
          <div className="no-tasks">
            <p>
              No tasks yet. <Link href="/tasks">Create your first task</Link>
            </p>
          </div>
        ) : (
          <div className="tasks-list">
            <TaskFilters
              priorities={priorities}
              categories={categories}
              priorityFilter={priorityFilter}
              categoryFilter={categoryFilter}
              onPriorityChange={setPriorityFilter}
              onCategoryChange={setCategoryFilter}
              priorityId="dashboardPriorityFilter"
              categoryId="dashboardCategoryFilter"
            />
            <TaskList
              tasks={filteredTasks.slice(0, 5)}
              categories={categories}
              priorities={priorities}
              compact
            />
            <Link href="/tasks" className="view-all">
              View All Tasks
            </Link>
          </div>
        )}
      </AppShell>
    </AuthGuard>
  )
}
