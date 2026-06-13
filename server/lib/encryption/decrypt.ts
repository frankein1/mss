import { getKeyManagerClient } from './kms'
import { ALGORITHMS, type DataForEncryptionContext } from './helper'
import { internal } from '~/utils/api/errors'
import { createCanonicalAuthenticatedData } from './generate-encryption-context'
import { webcrypto } from 'node:crypto'
import type { RuntimeConfig } from 'nuxt/schema'

const V2_ALGORITHM = 'aes_256_gcm' as const

interface DecryptMetadata {
  encryptionVersion: string
  // TODO: remove v1 fields after local dev migration
  encryptionAlgorithm?: string
  kmsKeyId?: string
}

export async function decrypt(
  config: Pick<RuntimeConfig, 'kms' | 'document'>,
  encryptedContent: Uint8Array,
  encryptedDataKey: string,
  ivBase64: string,
  metadata: DecryptMetadata,
  dataForEncryptionContext: DataForEncryptionContext
) {
  const kms = await getKeyManagerClient(config)

  const { algorithmName, kmsKeyId, additionalData } =
    resolveDecryptionParams(config, metadata, encryptedDataKey, dataForEncryptionContext)

  const dataKey = await kms.decrypt({
    keyId: kmsKeyId,
    ciphertext: encryptedDataKey
  })

  const extractable = false
  const encryptionKey = await webcrypto.subtle.importKey(
    'raw',
    Buffer.from(dataKey.plaintext, 'base64'),
    algorithmName,
    extractable,
    ['decrypt']
  )

  const params: AesGcmParams = {
    name: algorithmName,
    iv: Buffer.from(ivBase64, 'base64'),
    additionalData,
    tagLength: 128
  }

  const fileContent = await webcrypto.subtle.decrypt(
    params,
    encryptionKey,
    encryptedContent
  )

  return { fileContent }
}

function resolveDecryptionParams(
  config: Pick<RuntimeConfig, 'kms'>,
  metadata: DecryptMetadata,
  encryptedDataKey: string,
  dataForEncryptionContext: DataForEncryptionContext
) {
  // TODO: remove v1 encryption support after local dev migration
  if (metadata.encryptionVersion === '1') {
    if (!metadata.encryptionAlgorithm || !metadata.kmsKeyId) {
      throw internal('decrypt: missing v1 metadata fields')
    }

    return {
      algorithmName: ALGORITHMS[metadata.encryptionAlgorithm as keyof typeof ALGORITHMS],
      kmsKeyId: metadata.kmsKeyId,
      additionalData: createCanonicalAuthenticatedData({
        encryptionVersion: '1',
        encryptionAlgorithm: metadata.encryptionAlgorithm,
        kmsKeyId: metadata.kmsKeyId,
        encryptedDataKey,
        documentKeyInDB: dataForEncryptionContext.documentKey,
        contentType: dataForEncryptionContext.contentType,
        contentLength: dataForEncryptionContext.contentLength
      })
    }
  }

  if (metadata.encryptionVersion === '2') {
    return {
      algorithmName: ALGORITHMS[V2_ALGORITHM],
      kmsKeyId: config.kms.keyId,
      additionalData: createCanonicalAuthenticatedData({
        encryptionVersion: '2',
        documentKeyInDB: dataForEncryptionContext.documentKey
      })
    }
  }

  throw internal('decrypt: unsupported encryption version')
}
