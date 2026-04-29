import { describe, test, expect } from 'vitest'
import { toKindOfBoolean } from './toKindOfBoolean'

describe('toKindOfBoolean', () => {
  test.each([
    { input: true, expected: 'true' },
    { input: false, expected: 'false' },
    { input: null, expected: undefined },
    { input: undefined, expected: undefined }
  ])('converts $input to $expected', ({ input, expected }) => {
    expect(toKindOfBoolean(input)).toBe(expected)
  })
})
