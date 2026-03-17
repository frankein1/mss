import { createClient, KeyManagerv1alpha1 } from '@scaleway/sdk'
import type { RuntimeConfig } from 'nuxt/schema'
import type { KmsClient } from './interface'

let instance: any = null
let kms: KmsClient | null = null

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

function createScalewayKmsAdapter(api: KeyManagerv1alpha1.API): KmsClient {
  return {
    generateDataKey: async params => {
      return api.generateDataKey({
        algorithm:
          params.algorithm as KeyManagerv1alpha1.DataKeyAlgorithmSymmetricEncryption,
        keyId: params.keyId,
        withoutPlaintext: params.withoutPlaintext
      })
    },
    decrypt: async params => {
      return api.decrypt({
        keyId: params.keyId,
        ciphertext: params.ciphertext
      })
    }
  }
}

export function getScalewayKeyManagerClient(
  config: Pick<RuntimeConfig, 'kms'>
) {
  if (kms) {
    return kms
  }

  const client = getScalewayClient(config)
  kms = createScalewayKmsAdapter(new KeyManagerv1alpha1.API(client))

  return kms
}
