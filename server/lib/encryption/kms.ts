import { createClient, KeyManagerv1alpha1 } from '@scaleway/sdk'

let instance: any = null

function getScalewayClient() {
  if (instance) {
    return instance
  }

  const config = useRuntimeConfig()

  instance = createClient({
    accessKey: config.kms.accessKeyId,
    secretKey: config.kms.secretKey,
    defaultProjectId: config.kms.projectId,
    defaultRegion: config.kms.region
  })

  return instance
}

let kms: KeyManagerv1alpha1.API | null = null

export function getKeyManagerClient() {
  if (kms) {
    return kms
  }

  const client = getScalewayClient()
  kms = new KeyManagerv1alpha1.API(client)

  return kms
}
