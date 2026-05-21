import { formatDate, getErrorMessage } from '@/lib/utils'

describe('formatDate', () => {
  it('returns em dash for null', () => {
    expect(formatDate(null)).toBe('—')
  })

  it('returns em dash for undefined', () => {
    expect(formatDate(undefined)).toBe('—')
  })

  it('formats a valid date string', () => {
    const result = formatDate('2025-12-31T00:00:00.000Z')
    expect(result).toContain('2025')
    expect(result).toContain('Dec')
  })
})

describe('getErrorMessage', () => {
  it('extracts message from axios error', () => {
    const error = { response: { data: { message: 'Email already in use' } } }
    expect(getErrorMessage(error)).toBe('Email already in use')
  })

  it('joins array messages', () => {
    const error = { response: { data: { message: ['must not be empty', 'invalid email'] } } }
    expect(getErrorMessage(error)).toBe('must not be empty, invalid email')
  })

  it('returns message from Error instance', () => {
    expect(getErrorMessage(new Error('Network error'))).toBe('Network error')
  })

  it('returns fallback for unknown errors', () => {
    expect(getErrorMessage(null)).toBe('An unexpected error occurred')
  })
})
