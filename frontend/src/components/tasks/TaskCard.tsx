'use client'

import { Pencil, Trash2, Calendar, CheckCircle, Clock } from 'lucide-react'
import type { Task } from '@/types'
import { formatDate, cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const isDone = task.status === 'DONE'

  return (
    <div className={cn('card transition-all hover:shadow-md', isDone && 'opacity-70')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {isDone ? (
            <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={18} />
          ) : (
            <Clock className="text-amber-500 mt-0.5 shrink-0" size={18} />
          )}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'font-medium text-gray-900 truncate',
                isDone && 'line-through text-gray-500'
              )}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                <Calendar size={12} />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            aria-label="Editar tarea"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Eliminar tarea"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
            isDone
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          )}
        >
          {isDone ? 'Completada' : 'Pendiente'}
        </span>
      </div>
    </div>
  )
}
