export interface JwtResponse {
  token?: string | null
  refreshToken?: string | null
  firstName?: string | null
  lastName?: string | null
}

export interface Login {
  email: string
  password: string
}

export interface RefreshTokenModel {
  jwt?: string | null
  refreshToken?: string | null
}

export interface Register {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface Message {
  messages?: string[] | null
}

export interface TodoCategory {
  id: string
  categoryName?: string | null
  categorySort: number
  syncDt: string
}

export interface TodoCategoryCreate {
  categoryName?: string | null
  categorySort: number
}

export interface TodoPriority {
  id: string
  priorityName?: string | null
  prioritySort: number
  syncDt: string
}

export interface TodoPriorityCreate {
  priorityName?: string | null
  prioritySort: number
  syncDt: string
}

export interface TodoTask {
  id: string
  taskName?: string | null
  taskSort: number
  createdDt: string
  dueDt?: string | null
  isCompleted: boolean
  isArchived: boolean
  todoCategoryId: string
  todoPriorityId: string
  syncDt: string
}

export interface TodoTaskCreate {
  taskName?: string | null
  taskSort: number
  createdDt: string
  dueDt?: string | null
  isCompleted: boolean
  isArchived: boolean
  todoCategoryId: string
  todoPriorityId: string
}
