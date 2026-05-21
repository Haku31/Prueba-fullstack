import api from './axios'
import type { AuthResponse } from '@/types'

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
  return data
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password })
  return data
}

export function saveAuth(token: string, user: AuthResponse['user']) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function getStoredUser(): AuthResponse['user'] | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('user')
  return stored ? JSON.parse(stored) : null
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}
