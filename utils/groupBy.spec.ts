import { describe, test, expect } from 'vitest'
import groupBy from './groupBy'

describe('groupBy', () => {
  test('should group items by key', () => {
    const items = [
      { type: 'a', value: 1 },
      { type: 'b', value: 2 },
      { type: 'a', value: 3 }
    ]

    expect(groupBy(items, item => item.type)).toEqual({
      a: [
        { type: 'a', value: 1 },
        { type: 'a', value: 3 }
      ],
      b: [{ type: 'b', value: 2 }]
    })
  })

  test('should return empty object for empty array', () => {
    expect(groupBy([], () => 'key')).toEqual({})
  })

  test('should handle single-item groups', () => {
    const items = [1, 2, 3]
    expect(groupBy(items, n => n)).toEqual({ 1: [1], 2: [2], 3: [3] })
  })

  test('should provide index to keySelector', () => {
    const items = ['a', 'b', 'c']
    expect(groupBy(items, (_, i) => (i < 2 ? 'first' : 'second'))).toEqual({
      first: ['a', 'b'],
      second: ['c']
    })
  })

  test('should accept iterable input', () => {
    const set = new Set([1, 2, 3])
    expect(groupBy(set, n => (n % 2 === 0 ? 'even' : 'odd'))).toEqual({
      odd: [1, 3],
      even: [2]
    })
  })
})
