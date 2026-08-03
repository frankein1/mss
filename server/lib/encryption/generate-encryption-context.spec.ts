import { test, expect } from 'vitest'
import { createCanonicalAuthenticatedData } from './generate-encryption-context'

test('createCanonicalAuthenticatedData throws if version is not supported', () => {
  expect(() =>
    createCanonicalAuthenticatedData({
      encryptionVersion: '10',
      encryptionAlgorithm: '',
      documentKeyInDB: ''
    })
  ).toThrowError(/encryption version unsupported/i)
})

const baseContext = {
  encryptionVersion: '1',
  encryptionAlgorithm: 'aes_256_gcm',
  documentKeyInDB: '7355864a-7165-4bf4-b325-dd0f088c4980'
}

test('createCanonicalAuthenticatedData is different when fields are changed', () => {
  const refAAD = createCanonicalAuthenticatedData(baseContext)

  Object.entries(baseContext)
    .filter(([key, _]) => key !== 'encryptionVersion')
    .forEach(([key, value]) => {
      const updatedAAD = {
        ...baseContext,
        [key]: value + '_updated'
      }
      expect(createCanonicalAuthenticatedData(updatedAAD)).not.toEqual(refAAD)
    })
})
