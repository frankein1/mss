import { internal } from '~/utils/api/errors'

interface EncryptionContext {
  encryptionVersion: string
  encryptionAlgorithm: string
  documentKeyInDB: string
}
/** Generate a **deterministic** encoding for Associated Authenticated Data (AAD) since it is used in
 * **byte-for-byte** comparison upon decryption. See
 * https://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/concepts.html#encryption-context.
 *
 * The data order in the buffer is:
 *
 * - for encryption version 1:
 * [
 *   encryptionVersion,
 *   encryptionAlgorithm,
 *   documentKeyInDB
 * ]
 *
 * Strings are encoded in utf8 format.
 *
 * WARNING!! Once real documents have been encrypted, no modification of this function can be
 * performed without changing the encryption version
 *
 * WARNING!! If this function is modified, then:
 * 1. the encryption version must be incremented (it is an integer cast as string)
 * 2. the new AAD generation must be associated to the latest encryption version
 * 3. The previous AAD generation code versions MUST be preserved and associated to
 *    their corresponding version otherwise the file decryption will be impossible for the
 *    older files and the files will be permanently lost.
 */
export function createCanonicalAuthenticatedData({
  encryptionVersion,
  encryptionAlgorithm,
  documentKeyInDB
}: EncryptionContext) {
  if (encryptionVersion === '1') {
    return Buffer.concat([
      Buffer.from(encryptionVersion, 'utf-8'),
      Buffer.from(encryptionAlgorithm, 'utf-8'),
      Buffer.from(documentKeyInDB, 'utf-8')
    ])
  }

  throw internal('generate-encryption-context: encryption version unsupported')
}
