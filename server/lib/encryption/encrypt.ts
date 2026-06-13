import { getKeyManagerClient } from './kms'
import { webcrypto } from 'node:crypto'
import { badrequest, internal } from '~/utils/api/errors'
import { createCanonicalAuthenticatedData } from './generate-encryption-context'
import { ALGORITHMS, type DataForEncryptionContext } from './helper'
import type { RuntimeConfig } from 'nuxt/schema'

// This is a mistake
const V2_ALGORITHM = 'aes_256_gcm' as const

export async function encrypt(
  config: Pick<RuntimeConfig, 'kms' | 'document'>,
  fileContent: Buffer,
  dataForEncryptionContext: DataForEncryptionContext
) {
  const kms = await getKeyManagerClient(config)

  if (config.document.encryptionVersion !== '2') {
    throw internal('encrypt: unsupported encryption version')
  }

  const dataKey = await kms.generateDataKey({
    algorithm: V2_ALGORITHM,
    keyId: config.kms.keyId,
    withoutPlaintext: false
  })

  if (!dataKey.plaintext) {
    throw badrequest('encrypt: could not retrieve data key')
  }

  const algorithm = ALGORITHMS[V2_ALGORITHM]
  const extractable = false
  const encryptionKey = await webcrypto.subtle.importKey(
    'raw',
    Buffer.from(dataKey.plaintext, 'base64'),
    { name: algorithm },
    extractable,
    ['encrypt']
  )

  const iv = crypto.getRandomValues(new Uint8Array(12))

  const additionalData = createCanonicalAuthenticatedData({
    // This is a mistake
    encryptionVersion: '2',
    documentKeyInDB: dataForEncryptionContext.documentKey
  })

  const params: AesGcmParams = {
    name: algorithm,
    iv,
    additionalData,
    tagLength: 128
  }

  const encryptedContent = await webcrypto.subtle.encrypt(
    params,
    encryptionKey,
    fileContent
  )

  return {
    encryptedContent,
    encryptedDataKey: dataKey.ciphertext,
    ivBase64: Buffer.from(iv).toString('base64')
  }
}
