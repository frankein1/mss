import { describe, test, expect } from 'vitest'
import { formatSearchPattern } from './formatSearchPattern'

describe('formatSearchPattern', () => {
  test('should remove diacritics', () => {
    expect(formatSearchPattern('éàü')).toBe('eau')
  })

  test('should lowercase the result', () => {
    expect(formatSearchPattern('DUPONT')).toBe('dupont')
  })

  test('should remove parentheses and slashes', () => {
    expect(formatSearchPattern('hello (world) /test\\')).toBe(
      'hello world test'
    )
  })

  test('should replace dashes with spaces', () => {
    expect(formatSearchPattern('Saint-Étienne')).toBe('saint etienne')
  })

  test('should collapse multiple spaces into one', () => {
    expect(formatSearchPattern('a   b     c')).toBe('a b c')
  })

  test('should trim whitespace', () => {
    expect(formatSearchPattern('  hello  ')).toBe('hello')
  })

  test('should handle combined transformations', () => {
    expect(formatSearchPattern('  (Héloïse) / Saint-Denis  ')).toBe(
      'heloise saint denis'
    )
  })

  test('should not decompose œ ligature (NFKD limitation)', () => {
    expect(formatSearchPattern('œuvre')).toBe('œuvre')
    expect(formatSearchPattern('cœur')).toBe('cœur')
  })

  test('should not decompose Œ ligature', () => {
    expect(formatSearchPattern('Œuvre')).toBe('œuvre')
  })

  test('should not decompose æ ligature', () => {
    expect(formatSearchPattern('æ')).toBe('æ')
  })

  test('should preserve dots and commas', () => {
    expect(formatSearchPattern('hello.world')).toBe('hello.world')
    expect(formatSearchPattern('a, b')).toBe('a, b')
  })

  test('should preserve @ and other non-stripped characters', () => {
    expect(formatSearchPattern('user@example')).toBe('user@example')
    expect(formatSearchPattern("l'apostrophe")).toBe("l'apostrophe")
  })
})
