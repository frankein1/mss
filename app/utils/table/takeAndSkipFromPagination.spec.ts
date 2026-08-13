import { describe, test, expect } from 'vitest'
import { takeAndSkipFromPagination } from './takeAndSkipFromPagination'

describe('takeAndSkipFromPagination', () => {
  test('should return take and skip for page 1', () => {
    expect(takeAndSkipFromPagination({ page: 1, perPage: 10 })).toEqual({
      take: 10,
      skip: 0
    })
  })

  test('should compute skip for subsequent pages', () => {
    expect(takeAndSkipFromPagination({ page: 3, perPage: 10 })).toEqual({
      take: 10,
      skip: 20
    })
  })

  test('should return undefined take and skip when perPage is negative', () => {
    expect(takeAndSkipFromPagination({ page: 1, perPage: -1 })).toEqual({
      take: undefined,
      skip: undefined
    })
  })

  test('should handle perPage of 1', () => {
    expect(takeAndSkipFromPagination({ page: 5, perPage: 1 })).toEqual({
      take: 1,
      skip: 4
    })
  })
})
