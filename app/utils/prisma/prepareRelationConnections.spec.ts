import { describe, test, expect } from 'vitest'
import { prepareRelationConnections } from './prepareRelationConnections'

describe('prepareRelationConnections', () => {
  test('should connect new ids and disconnect removed ids', () => {
    const result = prepareRelationConnections(['1', '2', '3'], ['2', '4'])

    expect(result.connect).toEqual([{ id: '1' }, { id: '3' }])
    expect(result.disconnect).toEqual([{ id: '4' }])
  })

  test('should return empty arrays when inputs are identical', () => {
    const result = prepareRelationConnections(['1', '2'], ['1', '2'])

    expect(result.connect).toEqual([])
    expect(result.disconnect).toEqual([])
  })

  test('should connect all when previous is empty', () => {
    const result = prepareRelationConnections(['1', '2'], [])

    expect(result.connect).toEqual([{ id: '1' }, { id: '2' }])
    expect(result.disconnect).toEqual([])
  })

  test('should disconnect all when updated is empty', () => {
    const result = prepareRelationConnections([], ['1', '2'])

    expect(result.connect).toEqual([])
    expect(result.disconnect).toEqual([{ id: '1' }, { id: '2' }])
  })

  test('should handle both empty arrays', () => {
    const result = prepareRelationConnections([], [])

    expect(result.connect).toEqual([])
    expect(result.disconnect).toEqual([])
  })
})
