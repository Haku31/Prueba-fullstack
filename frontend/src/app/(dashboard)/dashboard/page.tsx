'use client'

import { useState } from 'react'
import { Plus, Filter } from 'lucide-react'
import { ProtectedRoute } from '@/components/ui/ProtectedRoute'
import { Navbar } from '@/components/ui/Navbar'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskModal } from '@/components/tasks/TaskModal'
import { DeleteConfirmModal } from '@/components/tasks/DeleteConfirmModal'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks'
import { getErrorMessage } from '@/lib/utils'
import type { Task, TaskStatus } from '@/types'

type FilterStatus = 'ALL' | TaskStatus

export default function DashboardPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL')
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const { data, isLoading, isError } = useTasks({
    status: filterStatus === 'ALL' ? undefined : filterStatus,
    page,
    limit: 9,
  })

  const createMutation = useCreateTask()
  const updateMutation = useUpdateTask()
  const deleteMutation = useDeleteTask()

  const handleStatusFilter = (status: FilterStatus) => {
    setFilterStatus(status)
    setPage(1)
  }

  const handleOpenCreate = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleSubmitTask = async (data: {
    title: string
    description?: string
    status: 'PENDING' | 'DONE'
    dueDate?: string
  }) => {
    setError('')
    try {
      const payload = {
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        dueDate: data.dueDate || undefined,
      }

      if (editingTask) {
        await updateMutation.mutateAsync({ id: editingTask.id, data: payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      handleCloseModal()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingTaskId) return
    try {
      await deleteMutation.mutateAsync(deletingTaskId)
      setDeletingTaskId(null)
    } catch (err) {
      setError(getErrorMessage(err))
      setDeletingTaskId(null)
    }
  }

  const isMutating = createMutation.isPending || updateMutation.isPending

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
            <button onClick={handleOpenCreate} className="btn-primary flex items-center gap-2">
              <Plus size={18} />
              New Task
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <div className="flex items-center gap-2 mb-6">
            <Filter size={16} className="text-gray-400" />
            {(['ALL', 'PENDING', 'DONE'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
            {data && (
              <span className="text-sm text-gray-400 ml-auto">
                {data.meta.total} task{data.meta.total !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {isLoading && (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
          )}

          {isError && (
            <div className="text-center py-16 text-red-500">Failed to load tasks. Try refreshing.</div>
          )}

          {!isLoading && !isError && data?.data.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No tasks found</p>
              <p className="text-gray-400 text-sm mt-1">
                {filterStatus !== 'ALL' ? 'Try a different filter' : 'Create your first task to get started'}
              </p>
            </div>
          )}

          {data && data.data.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.data.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleOpenEdit}
                    onDelete={(id) => setDeletingTaskId(id)}
                  />
                ))}
              </div>

              {data.meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 1}
                    className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500">
                    Page {data.meta.page} of {data.meta.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === data.meta.totalPages}
                    className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        <TaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitTask}
          task={editingTask}
          isLoading={isMutating}
        />

        <DeleteConfirmModal
          isOpen={!!deletingTaskId}
          onClose={() => setDeletingTaskId(null)}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </ProtectedRoute>
  )
}
