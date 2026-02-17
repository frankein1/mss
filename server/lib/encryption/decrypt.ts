import { getKeyManagerClient } from './kms'
import {
  ALGORITHMS,
  throwIfEncryptionConfigurationIsNotSetup,
  type DataForEncryptionContext
} from './helper'
import { internal } from '~/utils/api/errors'
import { createCanonicalAuthenticatedData } from './generate-encryption-context'
import { webcrypto } from 'node:crypto'
import type { RuntimeConfig } from 'nuxt/schema'

export async function decrypt(
  config: Pick<RuntimeConfig, 'kms' | 'document'>,
  encryptedContent: Buffer,
  encryptedDataKey: string,
  ivBase64: string,
  metadata: {
    encryptionVersion: string
    encryptionAlgorithm: string
    kmsKeyId: string
  },
  dataForEncryptionContext: DataForEncryptionContext
) {
  const kms = getKeyManagerClient(config)

  throwIfEncryptionConfigurationIsNotSetup(config)

  if (metadata.encryptionAlgorithm !== 'aes_256_gcm') {
    throw internal('decrypt: improper algorithm')
  }

  /** The encrypted data key (DEK) derived from the main key KEK (stored in the Key Manager)
   * is decrypted by the Key Management Service
   *
   * WARNING! The plaintext DEK MUST NEVER be logged.
   * WARNING! The plaintext DEK MUST NEVER be transmitted or stored outside of the server.
   */
  const dataKey = await kms.decrypt({
    keyId: metadata.kmsKeyId,
    ciphertext: encryptedDataKey
  })

  /** The webcrypto API needs to import the DEK in a specific format */
  const algorithm = ALGORITHMS[metadata.encryptionAlgorithm]
  const extractable = false
  const encryptionKey = await webcrypto.subtle.importKey(
    'raw',
    Buffer.from(dataKey.plaintext, 'base64'),
    algorithm,
    extractable,
    ['decrypt']
  )

  /** Associated Authenticated Data (AAD) binary data is recreated for decryption from
   * the S3 Metadata and file metadata coming from the database.
   *
   * In order to decrypt the content, it must be *byte-for-byte* identical to the AAD
   * used to encrypt the content.
   */
  const additionalData = createCanonicalAuthenticatedData({
    encryptionVersion: metadata.encryptionVersion,
    encryptionAlgorithm: metadata.encryptionAlgorithm,
    kmsKeyId: metadata.kmsKeyId,
    encryptedDataKey,
    documentKeyInDB: dataForEncryptionContext.documentKey,
    contentType: dataForEncryptionContext.contentType,
    contentLength: dataForEncryptionContext.contentLength
  })

  const params: AesGcmParams = {
    name: algorithm,
    /** The Initialization vector is retrieved from the file metadata */
    iv: Buffer.from(ivBase64, 'base64'),
    additionalData,
    // size in bits of the authentication tag generated in the encryption operation and used for authentication in the corresponding decryption.
    // the AES-GCM specification recommends that it should be 96, 104, 112, 120, or 128
    // see https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams
    tagLength: 128
  }

  const fileContent = await webcrypto.subtle.decrypt(
    params,
    encryptionKey,
    encryptedContent
  )

  return { fileContent }
}
