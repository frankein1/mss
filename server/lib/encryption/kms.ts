import type { RuntimeConfig } from 'nuxt/schema'
import type { KmsClient } from './adapters/interface'
import { getScalewayKeyManagerClient } from './adapters/scaleway-km'
import { getOpenBaoKeyManagerClient } from './adapters/open-bao'

/**
 * Factory function that returns the appropriate KMS client implementation
 * based on the configured environment.
 *
 * - 'local': OpenBao (for local development with Docker)
 * - other: Scaleway (production)
 */
export async function getKeyManagerClient(
  config: Pick<RuntimeConfig, 'kms' | 'public'>
): Promise<KmsClient> {
  return config.public.mssEnvironment === 'local'
    ? await getOpenBaoKeyManagerClient(config)
    : getScalewayKeyManagerClient(config)
}
