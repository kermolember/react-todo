'use client'

import { createContext, useCallback, useMemo, useState } from 'react'
import { apiRequest } from '@/lib/api'
import { sortTasks } from '@/lib/todoSort'
import type {
  TodoCategory,
  TodoCategoryCreate,
  TodoPriority,
  TodoPriorityCreate,
  TodoTask,
  TodoTaskCreate,
} from '@/types/api'

type TodoContextValue = {
  categories: TodoCategory[]
  priorities: TodoPriority[]
  tasks: TodoTask[]
  fetchCategories: () => Promise<void>
  createCategory: (category: TodoCategoryCreate) => Promise<TodoCategory>
  updateCategory: (id: string, category: TodoCategory) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  fetchPriorities: () => Promise<void>
  createPriority: (priority: TodoPriorityCreate) => Promise<TodoPriority>
  updatePriority: (id: string, priority: TodoPriority) => Promise<void>
  deletePriority: (id: string) => Promise<void>
  fetchTasks: () => Promise<void>
  createTask: (task: TodoTaskCreate) => Promise<TodoTask>
  updateTask: (id: string, task: TodoTask) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export const TodoContext = createContext<TodoContextValue | undefined>(undefined)

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<TodoCategory[]>([])
  const [priorities, setPriorities] = useState<TodoPriority[]>([])
  const [tasks, setTasks] = useState<TodoTask[]>([])

  const fetchCategories = useCallback(async () => {
    const response = await apiRequest('TodoCategories')
    if (!response.ok) throw new Error(`Failed to fetch categories: ${response.statusText}`)
    setCategories(await response.json())
  }, [])

  const createCategory = useCallback(async (category: TodoCategoryCreate) => {
    const response = await apiRequest('TodoCategories', {
      method: 'POST',
      body: JSON.stringify(category),
    })
    if (!response.ok) throw new Error(`Failed to create category: ${response.statusText}`)
    const newCategory: TodoCategory = await response.json()
    setCategories((prev) => [...prev, newCategory])
    return newCategory
  }, [])

  const updateCategory = useCallback(async (id: string, category: TodoCategory) => {
    const response = await apiRequest(`TodoCategories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    })
    if (!response.ok) throw new Error(`Failed to update category: ${response.statusText}`)
    setCategories((prev) => prev.map((item) => (item.id === id ? category : item)))
  }, [])

  const deleteCategory = useCallback(async (id: string) => {
    const response = await apiRequest(`TodoCategories/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error(`Failed to delete category: ${response.statusText}`)
    setCategories((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const fetchPriorities = useCallback(async () => {
    const response = await apiRequest('TodoPriorities')
    if (!response.ok) throw new Error(`Failed to fetch priorities: ${response.statusText}`)
    setPriorities(await response.json())
  }, [])

  const createPriority = useCallback(async (priority: TodoPriorityCreate) => {
    const response = await apiRequest('TodoPriorities', {
      method: 'POST',
      body: JSON.stringify(priority),
    })
    if (!response.ok) throw new Error(`Failed to create priority: ${response.statusText}`)
    const newPriority: TodoPriority = await response.json()
    setPriorities((prev) => [...prev, newPriority])
    return newPriority
  }, [])

  const updatePriority = useCallback(async (id: string, priority: TodoPriority) => {
    const response = await apiRequest(`TodoPriorities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(priority),
    })
    if (!response.ok) throw new Error(`Failed to update priority: ${response.statusText}`)
    setPriorities((prev) => prev.map((item) => (item.id === id ? priority : item)))
  }, [])

  const deletePriority = useCallback(async (id: string) => {
    const response = await apiRequest(`TodoPriorities/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error(`Failed to delete priority: ${response.statusText}`)
    setPriorities((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const fetchTasks = useCallback(async () => {
    const response = await apiRequest('TodoTasks')
    if (!response.ok) throw new Error(`Failed to fetch tasks: ${response.statusText}`)
    const data: TodoTask[] = await response.json()
    setTasks(sortTasks(data))
  }, [])

  const createTask = useCallback(async (task: TodoTaskCreate) => {
    const response = await apiRequest('TodoTasks', { method: 'POST', body: JSON.stringify(task) })
    if (!response.ok) throw new Error(`Failed to create task: ${response.statusText}`)
    const newTask: TodoTask = await response.json()
    setTasks((prev) => sortTasks([...prev, newTask]))
    return newTask
  }, [])

  const updateTask = useCallback(async (id: string, task: TodoTask) => {
    const response = await apiRequest(`TodoTasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    })
    if (!response.ok) throw new Error(`Failed to update task: ${response.statusText}`)
    setTasks((prev) => sortTasks(prev.map((item) => (item.id === id ? task : item))))
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    const response = await apiRequest(`TodoTasks/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error(`Failed to delete task: ${response.statusText}`)
    setTasks((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      categories,
      priorities,
      tasks,
      fetchCategories,
      createCategory,
      updateCategory,
      deleteCategory,
      fetchPriorities,
      createPriority,
      updatePriority,
      deletePriority,
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
    }),
    [
      categories,
      priorities,
      tasks,
      fetchCategories,
      createCategory,
      updateCategory,
      deleteCategory,
      fetchPriorities,
      createPriority,
      updatePriority,
      deletePriority,
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
    ],
  )

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}
