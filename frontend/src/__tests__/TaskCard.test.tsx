import { render, screen, fireEvent } from '@testing-library/react'
import { TaskCard } from '@/components/tasks/TaskCard'
import type { Task } from '@/types'

const mockTask: Task = {
  id: 'task-1',
  title: 'Test Task',
  description: 'A test description',
  status: 'PENDING',
  dueDate: '2025-12-31T00:00:00.000Z',
  userId: 'user-1',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
}

describe('TaskCard', () => {
  it('renders task title and description', () => {
    const onEdit = jest.fn()
    const onDelete = jest.fn()

    render(<TaskCard task={mockTask} onEdit={onEdit} onDelete={onDelete} />)

    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('A test description')).toBeInTheDocument()
  })

  it('shows Pending badge for PENDING status', () => {
    render(<TaskCard task={mockTask} onEdit={jest.fn()} onDelete={jest.fn()} />)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('shows Done badge for DONE status', () => {
    const doneTask = { ...mockTask, status: 'DONE' as const }
    render(<TaskCard task={doneTask} onEdit={jest.fn()} onDelete={jest.fn()} />)
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn()
    render(<TaskCard task={mockTask} onEdit={onEdit} onDelete={jest.fn()} />)

    fireEvent.click(screen.getByLabelText('Edit task'))
    expect(onEdit).toHaveBeenCalledWith(mockTask)
  })

  it('calls onDelete with task id when delete button is clicked', () => {
    const onDelete = jest.fn()
    render(<TaskCard task={mockTask} onEdit={jest.fn()} onDelete={onDelete} />)

    fireEvent.click(screen.getByLabelText('Delete task'))
    expect(onDelete).toHaveBeenCalledWith('task-1')
  })

  it('displays the due date', () => {
    render(<TaskCard task={mockTask} onEdit={jest.fn()} onDelete={jest.fn()} />)
    expect(screen.getByText('Dec 31, 2025')).toBeInTheDocument()
  })
})
