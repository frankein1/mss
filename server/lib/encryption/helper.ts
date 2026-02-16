import type { RuntimeConfig } from 'nuxt/schema'
import { internal } from '~/utils/api/errors'

export const ALGORITHMS = {
  aes_256_gcm: 'AES-GCM'
}

export interface DataForEncryptionContext {
  documentKey: string
  contentType: string
  contentLength: number
}

// TODO move to server plugin env validator
export function throwIfEncryptionConfigurationIsNotSetup(
  config: Pick<RuntimeConfig, 'kms' | 'document'>
) {
  if (!config.document.encryptionAlgorithm) {
    throw internal('encrypt: no algorithm defined')
  }

  if (
    !config.kms.keyId ||
    !config.document.encryptionVersion ||
    !config.document.encryptionAlgorithm
  ) {
    throw internal('encrypt: missing configuration')
  }
}
