import { createHash } from 'node:crypto'
import { internal } from '~/utils/api/errors'

// TODO: remove v1 encryption support after local dev migration
interface EncryptionContextV1 {
  encryptionVersion: '1'
  encryptionAlgorithm: string
  kmsKeyId: string
  documentKeyInDB: string
  contentType: string
  contentLength: number
  encryptedDataKey: string
}

interface EncryptionContextV2 {
  encryptionVersion: '2'
  documentKeyInDB: string
}

type EncryptionContext = EncryptionContextV1 | EncryptionContextV2

export function createCanonicalAuthenticatedData(
  context: EncryptionContext
) {
  // TODO: remove v1 encryption support after local dev migration
  if (context.encryptionVersion === '1') {
    return Buffer.concat([
      Buffer.from(context.encryptionVersion, 'utf-8'),
      Buffer.from(context.encryptionAlgorithm, 'utf-8'),
      Buffer.from(context.kmsKeyId, 'utf-8'),
      createHash('sha256').update(context.encryptedDataKey).digest(),
      Buffer.from(context.documentKeyInDB, 'utf-8'),
      Buffer.from(context.contentType, 'utf-8'),
      Buffer.from(context.contentLength.toString(), 'utf-8')
    ])
  }

  if (context.encryptionVersion === '2') {
    return Buffer.concat([
      Buffer.from(context.encryptionVersion, 'utf-8'),
      Buffer.from(context.documentKeyInDB, 'utf-8')
    ])
  }

  throw internal('generate-encryption-context: encryption version unsupported')
}
