import type { RuntimeConfig } from 'nuxt/schema'

export default defineNitroPlugin(() => {
  if (process.env.CI) {
    return
  }
  const config = useRuntimeConfig()
  const errors: string[] = []

  const missingAuthKeys = Object.keys(config.auth).filter(
    k => !config.auth[k as keyof RuntimeConfig['auth']]
  )
  if (missingAuthKeys.length > 0) {
    errors.push(`missing auth configuration: ${missingAuthKeys.join(', ')}`)
  }

  if (config.document.useS3Storage) {
    const missingS3Keys = Object.keys(config.s3).filter(
      k => !config.s3[k as keyof RuntimeConfig['s3']]
    )
    if (missingS3Keys.length > 0) {
      errors.push(`missing s3 configuration: ${missingS3Keys.join(', ')}`)
    }

    const missingKmsKeys = Object.keys(config.kms).filter(
      k => !config.kms[k as keyof RuntimeConfig['kms']]
    )
    if (missingKmsKeys.length > 0) {
      errors.push(`missing kms configuration: ${missingKmsKeys.join(', ')}`)
    }

    if (
      !config.document.encryptionVersion ||
      !config.document.encryptionAlgorithm
    ) {
      errors.push('missing encryption configuration')
    }
  }

  if (errors.length > 0) {
    throw new Error(`env-validator: ${errors.join('; ')}`)
  }
})
