'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'
import { saveAuth, clearAuth, getStoredUser, getToken, login as apiLogin, register as apiRegister } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = getStoredUser()
    const token = getToken()
    if (storedUser && token) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { user, token } = await apiLogin(email, password)
    saveAuth(token, user)
    setUser(user)
    router.push('/dashboard')
  }

  const register = async (name: string, email: string, password: string) => {
    const { user, token } = await apiRegister(name, email, password)
    saveAuth(token, user)
    setUser(user)
    router.push('/dashboard')
  }

  const logout = () => {
    clearAuth()
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
