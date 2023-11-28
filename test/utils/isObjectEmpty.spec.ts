import { describe, it, expect } from 'vitest'
import { isObjectEmpty } from '~/utils/isObjectEmpty'

describe('isObjectEmpty', () => {
  it('computes if an object is empty', () => {
    expect(isObjectEmpty(undefined)).toBeTruthy()
    expect(isObjectEmpty({})).toBeTruthy()
    expect(isObjectEmpty({ foo: undefined })).toBeTruthy()
    expect(isObjectEmpty({ foo: null })).toBeTruthy()
    expect(isObjectEmpty({ foo: '' })).toBeTruthy()
    expect(isObjectEmpty({ foo: [] })).toBeTruthy()
    expect(
      isObjectEmpty({ foo: undefined, bar: null, baz: '', test: [] })
    ).toBeTruthy()

    expect(isObjectEmpty({ foo: 'bar' })).toBeFalsy()
    expect(isObjectEmpty({ foo: [1] })).toBeFalsy()
    expect(
      isObjectEmpty({
        foo: undefined,
        bar: null,
        baz: '',
        test: [],
        joe: 'bar'
      })
    ).toBeFalsy()
  })
})
