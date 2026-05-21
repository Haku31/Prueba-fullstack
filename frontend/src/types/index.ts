export type TaskStatus = 'PENDING' | 'DONE'

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description?: string | null
  status: TaskStatus
  dueDate?: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedTasks {
  data: Task[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiError {
  message: string | string[]
  statusCode: number
  error?: string
}
