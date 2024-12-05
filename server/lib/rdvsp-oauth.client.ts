import { Beneficiary } from '@prisma/client'
import { apiRoutes } from '~/utils/routes'

interface RdvspConfig {
  clientId: string
  clientSecret: string
  issuer: string
  redirectUri: string
}

interface RdvspAuthToken {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  scope: string
  created_at: number
}

interface RdvspAuthError {
  error: string
  error_description: string
}

interface RdvspError {
  status: boolean
  errors: string[]
}

interface RdvspAgentInfo {
  id: number
  email: string
  first_name: string
  inclusion_connect_open_id_sub: string | null
  last_name: string
}

let config: RdvspConfig | null = null

export function getConfig() {
  if (config !== null) {
    return config
  }

  const {
    public: { appUrl },
    rdvsp: { issuer, clientId, clientSecret }
  } = useRuntimeConfig()

  config = {
    clientId,
    clientSecret,
    issuer,
    redirectUri: `${appUrl}${apiRoutes.rdvsp.ApiCallback.path()}`
  }

  return config
}

export function authorize(cfg: RdvspConfig, nonce: string, state: string) {
  const params = new URLSearchParams({
    client_id: cfg.clientId,
    scope: 'write',
    response_type: 'code',
    redirect_uri: cfg.redirectUri,
    state,
    nonce
  })

  return `${cfg.issuer}/oauth/authorize?${params}`
}

export async function getToken(cfg: RdvspConfig, code: string) {
  const response = await fetch(`${cfg.issuer}/oauth/token`, {
    method: 'post',
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      redirect_uri: cfg.redirectUri,
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      code
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })

  const res = await response.json()

  if (response.ok) {
    return res as RdvspAuthToken
  }

  return res as RdvspAuthError
}

async function getWrapper<T>(
  cfg: RdvspConfig,
  path: string,
  accessToken: string
) {
  const response = await fetch(`${cfg.issuer}${path}`, {
    method: 'get',
    headers: { Authorization: `Bearer ${accessToken}` }
  })

  const res = await response.json()

  if (response.ok) {
    return res.agent as T
  }

  return res as RdvspAuthError
}

// Use zod to validate format ?
export async function getAgentInfo(cfg: RdvspConfig, accessToken: string) {
  return await getWrapper<RdvspAgentInfo>(cfg, '/api/v1/agents/me', accessToken)
}

export async function getOrganisation(cfg: RdvspConfig, accessToken: string) {
  return await getWrapper<RdvspAgentInfo>(
    cfg,
    '/api/v1/organisations',
    accessToken
  )
}

export async function createUsager(
  cfg: RdvspConfig,
  accessToken: string,
  organisationId: string,
  agentId: string,
  beneficiary: Pick<
    Beneficiary,
    'firstName' | 'usualName' | 'birthName' | 'birthDate' | 'email' | 'phone1'
  >
) {
  const response = await fetch(`${cfg.issuer}/api/v1/users`, {
    method: 'post',
    body: new URLSearchParams({
      ['organisation_ids[]']: organisationId,
      ['referent_agent_ids[]']: agentId,
      ...(beneficiary.firstName && { first_name: beneficiary.firstName }),
      ...(beneficiary.usualName && { last_name: beneficiary.usualName }),
      ...(beneficiary.birthName && { birth_name: beneficiary.birthName }),
      ...(beneficiary.birthDate && {
        birth_date: beneficiary.birthDate.toISOString().split('T')[0]
      }),
      ...(beneficiary.email && { email: beneficiary.email }),
      ...(beneficiary.phone1 && { phone_number: beneficiary.phone1 }),
      notify_by_sms: 'true',
      notify_by_email: 'true'
    }),
    headers: { Authorization: `Bearer ${accessToken}` }
  })

  let res: any
  try {
    res = await response.json()
  } catch {
    console.log('other error', response.statusText)
    return { status: response.status, statusText: response.statusText }
  }

  if (response.ok) {
    console.log('usager creation successful', res.user)
    return { id: res.user.id as number }
  }
  console.log('usager creation failed', res)
  return res as RdvspError
}
