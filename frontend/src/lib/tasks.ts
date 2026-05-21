import api from './axios'
import type { Task, PaginatedTasks } from '@/types'

export interface TaskFilters {
  status?: 'PENDING' | 'DONE'
  page?: number
  limit?: number
}

export async function getTasks(filters: TaskFilters = {}): Promise<PaginatedTasks> {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  const { data } = await api.get<PaginatedTasks>(`/tasks?${params.toString()}`)
  return data
}

export async function getTask(id: string): Promise<Task> {
  const { data } = await api.get<Task>(`/tasks/${id}`)
  return data
}

export interface CreateTaskData {
  title: string
  description?: string
  status?: 'PENDING' | 'DONE'
  dueDate?: string
}

export async function createTask(taskData: CreateTaskData): Promise<Task> {
  const { data } = await api.post<Task>('/tasks', taskData)
  return data
}

export async function updateTask(id: string, taskData: Partial<CreateTaskData>): Promise<Task> {
  const { data } = await api.put<Task>(`/tasks/${id}`, taskData)
  return data
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`)
}
