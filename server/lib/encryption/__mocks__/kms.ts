import { randomBytes } from 'node:crypto'
import type { RuntimeConfig } from 'nuxt/schema'
import type { KmsClient } from '../adapters/kms-client'

const fakeDekPlaintext = randomBytes(32).toString('base64')
const fakeDekCiphertext = `vault:v1:${randomBytes(32).toString('base64')}`

export function getKeyManagerClient(
  _: Pick<RuntimeConfig, 'kms'>
): Promise<KmsClient> {
  return Promise.resolve({
    generateDataKey: async () => ({
      plaintext: fakeDekPlaintext,
      ciphertext: fakeDekCiphertext
    }),
    decrypt: async () => ({
      plaintext: fakeDekPlaintext
    }),
    rewrap: async ({ ciphertext }) => {
      const dek = ciphertext.replace(/^vault:v\d+:/, '')
      return { ciphertext: `vault:v2:${dek}_rewrapped` }
    },
    getKeyLatestVersion: async () => 'v2'
  })
}
