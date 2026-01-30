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

export function throwIfEncryptionConfigurationIsNotSetup(
  config: RuntimeConfig
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
