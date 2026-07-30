import { describe, test, expect } from 'vitest'
import { prepareDocumentsMutations } from './prepareDocumentMutations'

describe('prepareDocumentsMutations', () => {
  test('should connect input documents and disconnect removed ones', () => {
    const result = prepareDocumentsMutations(
      ['key-1', 'key-3'],
      [{ key: 'key-1' } as any, { key: 'key-2' } as any]
    )

    expect(result.connect).toEqual([{ key: 'key-1' }, { key: 'key-3' }])
    expect(result.disconnect).toEqual([{ key: 'key-2' }])
  })

  test('should connect all when target documents is undefined', () => {
    const result = prepareDocumentsMutations(['key-1', 'key-2'], undefined)

    expect(result.connect).toEqual([{ key: 'key-1' }, { key: 'key-2' }])
    expect(result.disconnect).toBeUndefined()
  })

  test('should connect all when target documents is empty', () => {
    const result = prepareDocumentsMutations(['key-1'], [])

    expect(result.connect).toEqual([{ key: 'key-1' }])
    expect(result.disconnect).toEqual([])
  })

  test('should disconnect all when input documents is empty', () => {
    const result = prepareDocumentsMutations(
      [],
      [{ key: 'key-1' } as any, { key: 'key-2' } as any]
    )

    expect(result.connect).toEqual([])
    expect(result.disconnect).toEqual([{ key: 'key-1' }, { key: 'key-2' }])
  })
})
