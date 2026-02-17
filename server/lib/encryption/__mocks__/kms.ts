import { randomBytes } from 'node:crypto'
import type { RuntimeConfig } from 'nuxt/schema'

const fakeDekPlaintext = randomBytes(32).toString('base64')
const fakeDekCiphertext = 'fake-encrypted-dek'

export function getKeyManagerClient(_: Pick<RuntimeConfig, 'kms'>) {
  return {
    generateDataKey: async () => ({
      plaintext: fakeDekPlaintext,
      ciphertext: fakeDekCiphertext
    }),
    decrypt: async () => ({
      plaintext: fakeDekPlaintext
    })
  }
}
