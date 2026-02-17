import { createClient, KeyManagerv1alpha1 } from '@scaleway/sdk'
import type { RuntimeConfig } from 'nuxt/schema'

let instance: any = null

function getScalewayClient(config: Pick<RuntimeConfig, 'kms'>) {
  if (instance) {
    return instance
  }

  instance = createClient({
    accessKey: config.kms.accessKeyId,
    secretKey: config.kms.secretKey,
    defaultProjectId: config.kms.projectId,
    defaultRegion: config.kms.region
  })

  return instance
}

let kms: KeyManagerv1alpha1.API | null = null

export function getKeyManagerClient(config: Pick<RuntimeConfig, 'kms'>) {
  if (kms) {
    return kms
  }

  const client = getScalewayClient(config)
  kms = new KeyManagerv1alpha1.API(client)

  return kms
}
