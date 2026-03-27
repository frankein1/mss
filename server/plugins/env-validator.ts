import type { RuntimeConfig } from 'nuxt/schema'
import { internal } from '~/utils/api/errors'

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()

  if (config.document.useS3Storage) {
    /** Check S3 setup */
    if (
      Object.keys(config.s3).some(
        k => !config.s3[k as keyof RuntimeConfig['s3']]
      )
    ) {
      throw internal('env-validator: missing s3 configuration')
    }

    /** Check kms setup */
    if (
      Object.keys(config.kms).some(
        k => !config.kms[k as keyof RuntimeConfig['kms']]
      )
    ) {
      throw internal('env-validator: missing kms configuration')
    }

    if (!config.document.encryptionAlgorithm) {
      /** Check encryption setup is s3 storage is activated */
      throw internal('env-validator: no encryption algorithm defined')
    }

    if (
      !config.document.encryptionVersion ||
      !config.document.encryptionAlgorithm
    ) {
      throw internal('env-validator: missing encryption configuration')
    }
  }
})
