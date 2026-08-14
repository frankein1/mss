import { describe, test, expect } from 'vitest'
import emphasizeSearch from './emphasizeSearch'

describe('emphasizeSearch', () => {
  test('should bold the matching substring', () => {
    expect(
      emphasizeSearch({ input: 'Hello world', searchString: 'world' })
    ).toEqual([
      { text: 'Hello ', weight: 'normal' },
      { text: 'world', weight: 'bold' }
    ])
  })

  test('should match ignoring accents', () => {
    expect(
      emphasizeSearch({ input: 'Héloïse', searchString: 'heloise' })
    ).toEqual([{ text: 'Héloïse', weight: 'bold' }])
  })

  test('should match ignoring case', () => {
    expect(
      emphasizeSearch({ input: 'DUPONT Marie', searchString: 'dupont' })
    ).toEqual([
      { text: 'DUPONT', weight: 'bold' },
      { text: ' Marie', weight: 'normal' }
    ])
  })

  test('should return full input as normal when no match', () => {
    expect(emphasizeSearch({ input: 'Hello', searchString: 'xyz' })).toEqual([
      { text: 'Hello', weight: 'normal' }
    ])
  })

  test('should return full input as normal when searchString is empty', () => {
    expect(emphasizeSearch({ input: 'Hello', searchString: '' })).toEqual([
      { text: 'Hello', weight: 'normal' }
    ])
  })

  test('should handle match at the beginning', () => {
    expect(emphasizeSearch({ input: 'abcdef', searchString: 'abc' })).toEqual([
      { text: 'abc', weight: 'bold' },
      { text: 'def', weight: 'normal' }
    ])
  })

  test('should handle match in the middle', () => {
    expect(emphasizeSearch({ input: 'abcdef', searchString: 'cd' })).toEqual([
      { text: 'ab', weight: 'normal' },
      { text: 'cd', weight: 'bold' },
      { text: 'ef', weight: 'normal' }
    ])
  })

  test('should match œ ligature when searching full word with oe', () => {
    expect(emphasizeSearch({ input: 'œuvre', searchString: 'oeuvre' })).toEqual(
      [{ text: 'œuvre', weight: 'bold' }]
    )
  })

  test('should match cœur when searching coeur', () => {
    expect(emphasizeSearch({ input: 'cœur', searchString: 'coeur' })).toEqual([
      { text: 'cœur', weight: 'bold' }
    ])
  })

  test('has off-by-one highlight when œ is part of a longer input (minor)', () => {
    expect(
      emphasizeSearch({ input: 'cœur bleu', searchString: 'coeur' })
    ).toEqual([
      { text: 'cœur ', weight: 'bold' },
      { text: 'bleu', weight: 'normal' }
    ])
  })

  test('has off-by-one highlight when searching partial oe in œ (minor)', () => {
    expect(emphasizeSearch({ input: 'cœur', searchString: 'oe' })).toEqual([
      { text: 'c', weight: 'normal' },
      { text: 'œu', weight: 'bold' },
      { text: 'r', weight: 'normal' }
    ])
  })

  test('should match special characters literally', () => {
    expect(
      emphasizeSearch({ input: 'hello@world', searchString: 'hello' })
    ).toEqual([
      { text: 'hello', weight: 'bold' },
      { text: '@world', weight: 'normal' }
    ])
  })

  test('should match around dots', () => {
    expect(emphasizeSearch({ input: 'a.b.c', searchString: 'b' })).toEqual([
      { text: 'a.', weight: 'normal' },
      { text: 'b', weight: 'bold' },
      { text: '.c', weight: 'normal' }
    ])
  })

  test('should match brackets literally', () => {
    expect(emphasizeSearch({ input: 'test[1]', searchString: '[1]' })).toEqual([
      { text: 'test', weight: 'normal' },
      { text: '[1]', weight: 'bold' }
    ])
  })
})
