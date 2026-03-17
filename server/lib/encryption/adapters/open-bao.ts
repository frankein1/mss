import type { RuntimeConfig } from 'nuxt/schema'
import { ofetch } from 'ofetch'
import type { KmsClient } from './interface'

let instance: {
  client: ReturnType<typeof ofetch.create>
  token: string
  expiresAt: Date
} | null = null
let kms: KmsClient | null = null

interface AppRoleLoginResponse {
  auth: {
    client_token: string
    lease_duration: number
  }
}

/** Get KMS access token from access/secret key */
const appRoleLogin = async (config: Pick<RuntimeConfig, 'kms'>) => {
  const res = await ofetch<AppRoleLoginResponse>(
    `${config.kms.apiUrl}/v1/auth/approle/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role_id: config.kms.accessKeyId,
        secret_id: config.kms.secretKey
      })
    }
  )

  return {
    token: res.auth.client_token,
    expiresAt: new Date(Date.now() + res.auth.lease_duration * 1000)
  }
}

async function getOpenBaoClient(config: Pick<RuntimeConfig, 'kms'>) {
  if (instance) {
    return instance
  }

  let authed = await appRoleLogin(config)

  instance = {
    ...authed,
    client: ofetch.create({
      baseURL: `${config.kms.apiUrl}/v1`,
      headers: { 'Content-Type': 'application/json' },
      retryStatusCodes: [401, 408, 409, 425, 429, 500, 502, 503, 504],
      async onRequest({ options }) {
        if (instance) {
          // Refresh auth when about to expire or if retried from error
          if (
            options.retry ||
            instance.expiresAt.getTime() + 5000 <= Date.now()
          ) {
            authed = await appRoleLogin(config)
            instance.token = authed.token
            instance.expiresAt = authed.expiresAt
          }
          options.headers.set('X-Vault-Token', instance.token)
        }
      }
    })
  }

  return instance
}

function createOpenBaoKmsAdapter(
  api: ReturnType<typeof ofetch.create>
): KmsClient {
  return {
    generateDataKey: async params => {
      const type = params.withoutPlaintext ? 'wrapped' : 'plaintext'
      const res = await api(`/transit/datakey/${type}/${params.keyId}`, {
        method: 'POST'
      })
      return res.data
    },
    decrypt: async params => {
      const res = await api(`/transit/decrypt/${params.keyId}`, {
        method: 'POST',
        body: { ciphertext: params.ciphertext }
      })
      return res.data
    }
  }
}

export async function getOpenBaoKeyManagerClient(
  config: Pick<RuntimeConfig, 'kms'>
) {
  if (kms) {
    return kms
  }

  const { client } = await getOpenBaoClient(config)
  kms = createOpenBaoKmsAdapter(client)

  return kms
}
