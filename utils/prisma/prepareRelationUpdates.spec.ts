import { describe, test, expect } from 'vitest'
import { prepareRelationUpdates } from './prepareRelationUpdates'

describe('prepareRelationUpdates', () => {
  test('should create new, delete removed, and update existing relations', () => {
    const updated = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob updated' },
      { id: '4', name: 'Dave' }
    ]
    const previous = [
      { id: '2', name: 'Bob' },
      { id: '3', name: 'Charlie' }
    ]

    const result = prepareRelationUpdates(updated, previous)

    expect(result.create).toEqual([
      { id: '1', name: 'Alice' },
      { id: '4', name: 'Dave' }
    ])
    expect(result.delete).toEqual([{ id: '3' }])
    expect(result.update).toEqual([
      { where: { id: '2' }, data: { name: 'Bob updated' } }
    ])
  })

  test('should return empty arrays when both inputs are empty', () => {
    const result = prepareRelationUpdates([], [])

    expect(result.create).toEqual([])
    expect(result.delete).toEqual([])
    expect(result.update).toEqual([])
  })

  test('should create all when previous is empty', () => {
    const updated = [{ id: '1', value: 'a' }]

    const result = prepareRelationUpdates(updated, [])

    expect(result.create).toEqual([{ id: '1', value: 'a' }])
    expect(result.delete).toEqual([])
    expect(result.update).toEqual([])
  })

  test('should delete all when updated is empty', () => {
    const previous = [{ id: '1' }, { id: '2' }]

    const result = prepareRelationUpdates([], previous)

    expect(result.create).toEqual([])
    expect(result.delete).toEqual([{ id: '1' }, { id: '2' }])
    expect(result.update).toEqual([])
  })

  test('should skip update when isUpdatable is false', () => {
    const updated = [{ id: '1', name: 'updated' }]
    const previous = [{ id: '1', name: 'original' }]

    const result = prepareRelationUpdates(updated, previous, false)

    expect(result.create).toEqual([])
    expect(result.delete).toEqual([])
    expect(result.update).toEqual([])
  })
})
