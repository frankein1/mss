import type { RuntimeConfig } from 'nuxt/schema'
import type { KmsClient } from './adapters/kms-client'
import { getOpenBaoKeyManagerClient } from './adapters/open-bao'

/**
 * Factory function that returns the appropriate KMS client implementation
 * based on the configured environment.
 *
 * - OpenBao: supported
 * - Scaleway: deprecated
 */
export async function getKeyManagerClient(
  config: Pick<RuntimeConfig, 'kms'>
): Promise<KmsClient> {
  return await getOpenBaoKeyManagerClient(config)
}
