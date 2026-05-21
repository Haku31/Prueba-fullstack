'use client'

import { useAuth } from '@/hooks/useAuth'
import { LogOut, CheckSquare } from 'lucide-react'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-primary-600" size={22} />
          <span className="font-semibold text-gray-900">Gestor de Tareas</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:block">
            {user?.name}
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut size={16} />
            <span className="hidden sm:block">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  )
}
