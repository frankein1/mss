import { test, expect } from 'vitest'
import { createCanonicalAuthenticatedData } from './generate-encryption-context'

test('createCanonicalAuthenticatedData throws if version is not supported', () => {
  expect(() =>
    createCanonicalAuthenticatedData({
      encryptionVersion: '10',
      encryptionAlgorithm: '',
      kmsKeyId: '',
      documentKeyInDB: '',
      contentType: '',
      contentLength: 1000,
      encryptedDataKey: ''
    })
  ).toThrowError(/encryption version unsupported/i)
})

const baseContext = {
  encryptionVersion: '1',
  encryptionAlgorithm: 'aes_256_gcm',
  kmsKeyId: '353cb6aa-9494-4add-a0dd-4b5d8607395dk',
  encryptedDataKey: 'encrypted-dek',
  documentKeyInDB: '7355864a-7165-4bf4-b325-dd0f088c4980',
  contentType: 'image/png',
  contentLength: 1000
}

test('createCanonicalAuthenticatedData is able to check different content length', () => {
  expect(
    createCanonicalAuthenticatedData({
      ...baseContext,
      contentLength: 1000
    })
  ).not.toEqual(
    createCanonicalAuthenticatedData({
      ...baseContext,
      contentLength: 1256
    })
  )
})

test('createCanonicalAuthenticatedData is different when fields are changed', () => {
  const refAAD = createCanonicalAuthenticatedData(baseContext)

  Object.entries(baseContext)
    .filter(
      ([key, _]) => key !== 'contentLength' && key !== 'encryptionVersion'
    )
    .forEach(([key, value]) => {
      const updatedAAD = {
        ...baseContext,
        [key]: value + '_updated'
      }
      expect(createCanonicalAuthenticatedData(updatedAAD)).not.toEqual(refAAD)
    })
})
