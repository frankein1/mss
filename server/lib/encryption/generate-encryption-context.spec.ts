import { describe, test, expect } from 'vitest'
import { createCanonicalAuthenticatedData } from './generate-encryption-context'

test('Encryption Context - Unsupported version - throws', () => {
  expect(() =>
    // @ts-expect-error testing runtime guard with invalid version
    createCanonicalAuthenticatedData({ encryptionVersion: '10', documentKeyInDB: '' })
  ).toThrowError(/encryption version unsupported/i)
})

describe('Encryption Context - v2 AAD', () => {
  const baseContextV2 = {
    encryptionVersion: '2' as const,
    documentKeyInDB: '7355864a-7165-4bf4-b325-dd0f088c4980'
  }

  test('Encryption Context - v2 AAD - produces different AAD when documentKeyInDB changes', () => {
    const aad1 = createCanonicalAuthenticatedData(baseContextV2)
    const aad2 = createCanonicalAuthenticatedData({
      ...baseContextV2,
      documentKeyInDB: 'other-key'
    })
    expect(aad1).not.toEqual(aad2)
  })

  test('Encryption Context - v2 AAD - is deterministic for the same inputs', () => {
    const aad1 = createCanonicalAuthenticatedData(baseContextV2)
    const aad2 = createCanonicalAuthenticatedData(baseContextV2)
    expect(aad1).toEqual(aad2)
  })

  test('Encryption Context - v2 AAD - includes encryptionVersion in the AAD', () => {
    const aadV2 = createCanonicalAuthenticatedData(baseContextV2)
    const aadDifferentVersion = createCanonicalAuthenticatedData({
      encryptionVersion: '1',
      encryptionAlgorithm: 'aes_256_gcm',
      kmsKeyId: 'key',
      encryptedDataKey: 'dek',
      documentKeyInDB: baseContextV2.documentKeyInDB,
      contentType: 'image/png',
      contentLength: 1000
    })
    expect(aadV2).not.toEqual(aadDifferentVersion)
  })
})

// TODO: remove v1 tests after local dev migration
describe('Encryption Context - v1 AAD', () => {
  const baseContextV1 = {
    encryptionVersion: '1' as const,
    encryptionAlgorithm: 'aes_256_gcm',
    kmsKeyId: '353cb6aa-9494-4add-a0dd-4b5d8607395dk',
    encryptedDataKey: 'encrypted-dek',
    documentKeyInDB: '7355864a-7165-4bf4-b325-dd0f088c4980',
    contentType: 'image/png',
    contentLength: 1000
  }

  test('Encryption Context - v1 AAD - is able to check different content length', () => {
    expect(
      createCanonicalAuthenticatedData({
        ...baseContextV1,
        contentLength: 1000
      })
    ).not.toEqual(
      createCanonicalAuthenticatedData({
        ...baseContextV1,
        contentLength: 1256
      })
    )
  })

  test('Encryption Context - v1 AAD - is different when fields are changed', () => {
    const refAAD = createCanonicalAuthenticatedData(baseContextV1)

    Object.entries(baseContextV1)
      .filter(
        ([key, _]) => key !== 'contentLength' && key !== 'encryptionVersion'
      )
      .forEach(([key, value]) => {
        const updatedAAD = {
          ...baseContextV1,
          [key]: value + '_updated'
        }
        expect(createCanonicalAuthenticatedData(updatedAAD as typeof baseContextV1)).not.toEqual(refAAD)
      })
  })
})
