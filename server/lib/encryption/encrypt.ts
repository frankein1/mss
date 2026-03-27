import { getKeyManagerClient } from './kms'
import { webcrypto } from 'node:crypto'
import { badrequest, internal } from '~/utils/api/errors'
import { createCanonicalAuthenticatedData } from './generate-encryption-context'
import { ALGORITHMS, type DataForEncryptionContext } from './helper'
import type { RuntimeConfig } from 'nuxt/schema'

export async function encrypt(
  config: Pick<RuntimeConfig, 'kms' | 'document'>,
  fileContent: Buffer,
  dataForEncryptionContext: DataForEncryptionContext
) {
  const kms = await getKeyManagerClient(config)

  if (config.document.encryptionAlgorithm !== 'aes_256_gcm') {
    throw internal('encrypt: improper algorithm')
  }

  /** From the Key Encryption Key (KEK) held by the KMS, a unique data key (DEK)
   * is generated per object to encrypt.
   *
   * Both the plaintext and encrypted version of the DEK are returned.
   *
   * The plaintext DEK encrypts the document.
   *
   * Only the encrypted DEK must be stored alongside the encrypted file.
   *
   * WARNING! The plaintext DEK MUST NEVER be logged.
   * WARNING! The plaintext DEK MUST NEVER be transmitted or stored outside of the server.
   */
  // TODO: create a eslint rule to prevent loggin of plaintext DEK
  const dataKey = await kms.generateDataKey({
    algorithm: config.document.encryptionAlgorithm,
    keyId: config.kms.keyId,
    withoutPlaintext: false
  })

  if (!dataKey.plaintext) {
    throw badrequest('encrypt: could not retrieve data key')
  }

  /** The webcrypto API needs to import the DEK in a specific format */
  const algorithm = ALGORITHMS[config.document.encryptionAlgorithm] || ''
  const extractable = false
  const encryptionKey = await webcrypto.subtle.importKey(
    'raw',
    Buffer.from(dataKey.plaintext, 'base64'),
    { name: algorithm },
    extractable,
    ['encrypt']
  )

  /** A unique nonce or Initialization Vector (IV) is generated for every encryption
   * operation performed with the same key.
   *
   * It is persisted IV together with the encrypted data so that decryption is possible.
   *
   * It must be truly random, so generated with the proper crypto lib.
   * */
  const iv = crypto.getRandomValues(new Uint8Array(12))

  /**  Associated Authenticated Data (AAD) allows to guarantee integrity of encrypted content
   *
   * https://aws.amazon.com/blogs/security/how-to-protect-the-integrity-of-your-encrypted-data-by-using-aws-key-management-service-and-encryptioncontext/
   */
  const additionalData = createCanonicalAuthenticatedData({
    encryptionVersion: config.document.encryptionVersion,
    encryptionAlgorithm: config.document.encryptionAlgorithm,
    kmsKeyId: config.kms.keyId,
    encryptedDataKey: dataKey.ciphertext,
    documentKeyInDB: dataForEncryptionContext.documentKey,
    contentType: dataForEncryptionContext.contentType,
    contentLength: dataForEncryptionContext.contentLength
  })

  const params: AesGcmParams = {
    name: algorithm,
    iv,
    additionalData,
    // size in bits of the authentication tag generated in the encryption operation and used for authentication in the corresponding decryption.
    // the AES-GCM specification recommends that it should be 96, 104, 112, 120, or 128
    // see https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams
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
    ivBase64: Buffer.from(iv).toString('base64'),
    kmsKeyId: config.kms.keyId
  }
}
