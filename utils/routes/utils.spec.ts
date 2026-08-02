import { describe, test, expect } from 'vitest'
import { getRouteOptions } from './utils'

describe('getRouteOptions', () => {
  test('returns empty string when options is undefined', () => {
    expect(getRouteOptions(undefined)).toBe('')
  })

  test('returns empty string when options is an empty object', () => {
    expect(getRouteOptions({})).toBe('')
  })

  test('returns hash when only tab is provided', () => {
    expect(getRouteOptions({ tab: 'MyTab' })).toBe('#MyTab')
  })

  test('returns query string when params are provided without tab', () => {
    expect(getRouteOptions({ key: 'value' })).toBe('?key=value')
  })

  test('returns query string with hash when tab and params are provided', () => {
    expect(getRouteOptions({ key: 'value', tab: 'MyTab' })).toBe(
      '?key=value#MyTab'
    )
  })

  test('returns empty string when an option value is undefined', () => {
    expect(getRouteOptions({ key: undefined })).toBe('')
  })
})
