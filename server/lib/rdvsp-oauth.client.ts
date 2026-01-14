import type { Beneficiary } from '@prisma/client'
import { formatAddress } from '~/utils'
import { apiRoutes } from '~/utils/routes'
import { formatDate } from '~/utils/formatDate'
import { ofetch, FetchError } from 'ofetch'
import { invalidError, unauthorizedError } from '~/server/trpc'
import type { RdvspStatus } from '~/types/rdvsp'

interface RdvspConfig {
  clientId: string
  clientSecret: string
  issuer: string
  redirectUri: string
}

interface RdvspAuthToken {
  access_token: string
  refresh_token: string
  token_type: 'Bearer'
  expires_in: number
  scope: string
  created_at: number
}

interface RdvspAuthError {
  error: string
  error_description: string
}

interface RdvspMutationError {
  success: boolean
  errors: string[]
}

interface GenericFetchError {
  status: number
  statusText: string
}

interface RdvspAgentInfo {
  id: number
  email: string
  first_name: string
  inclusion_connect_open_id_sub: string | null
  last_name: string
}

interface RdvspOrganisation {
  id: number
  email: string
  name: string | null
  phone_number: string
  verticale: string
}

export interface RdvspRdv {
  id: number
  address: string
  agents: { id: number; first_name: string; last_name: string }[]
  created_by_id: number
  duration_in_min: number
  motif: {
    id: number
    name: string
    collectif: boolean
    location_type: 'public_office' | 'phone'
  }
  status: RdvspStatus
  starts_at: string
  users: { id: number; first_name: string; last_name: string }[]
  participations: { id: number; first_name: string; last_name: string }[]
  url_for_agents: string
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

export async function refreshToken(refresh_token: string) {
  const config = getConfig()
  return ofetch(`${config.issuer}/oauth/token`, {
    method: 'post',
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token
    }).toString(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
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
  accessToken: string,
  transform: ((t: any) => T) | null = null
) {
  const headers = { Authorization: `Bearer ${accessToken}` }
  try {
    const res = await ofetch(`${cfg.issuer}${path}`, {
      headers,
      onRequest: () => console.log('rdvsp: request', path),
      onRequestError: req =>
        console.log('rdvsp: request error', req.error, req),
      onResponseError: res => console.log('rdvsp: response error', res.error)
    })
    if ('error' in res) {
      console.log('rdvsp: fetch error api internal error', res)
      throw invalidError('rdvsp: could not retrieve element requested')
    }

    return transform ? (transform(res) as T) : (res as T)
  } catch (e: unknown) {
    if (e instanceof FetchError) {
      if (e.status === 401) {
        throw unauthorizedError('rdvsp: not authenticated')
      } else {
        console.log('rdvsp: fetch error status', e.status)
        throw invalidError('rdvsp: could not process request')
      }
    }

    console.log('rdvsp: fetch error status', e)
    throw invalidError('rdvsp: unknown error')
  }
}

// Use zod to validate format ?
export async function getAgentInfo(cfg: RdvspConfig, accessToken: string) {
  return await getWrapper<RdvspAgentInfo>(
    cfg,
    '/api/v1/agents/me',
    accessToken,
    (t: any) => t.agent
  )
}

export async function getOrganisation(cfg: RdvspConfig, accessToken: string) {
  return await getWrapper<RdvspOrganisation>(
    cfg,
    '/api/v1/organisations',
    accessToken,
    (t: any) => t.organisations[0]
  )
}

export async function createRdvPlan(
  cfg: RdvspConfig,
  accessToken: string,
  beneficiary: Pick<
    Beneficiary,
    | 'id'
    | 'externalRdvspId'
    | 'firstName'
    | 'usualName'
    | 'birthName'
    | 'birthDate'
    | 'email'
    | 'phone1'
    | 'street'
    | 'zipcode'
    | 'city'
    | 'region'
  >,
  returnUrl: string,
  dossierUrl: string
): Promise<
  | { id: number; url: string; user_id: number }
  | RdvspMutationError
  | GenericFetchError
> {
  const address = formatAddress(beneficiary)

  if (beneficiary.externalRdvspId) {
    try {
      const userUpdateBody = {
        id: beneficiary.externalRdvspId,
        first_name: beneficiary.firstName || 'Non renseigné',
        last_name:
          beneficiary.usualName || beneficiary.birthName || 'Non renseigné',
        ...(beneficiary.email && { email: beneficiary.email }),
        ...(beneficiary.phone1 && { phone_number: beneficiary.phone1 }),
        ...(address && { address }),
        ...(beneficiary.birthDate && {
          birth_date: formatDate(beneficiary.birthDate, 'YYYY-MM-DD')
        })
      }
      await fetch(`${cfg.issuer}/api/v1/users/${beneficiary.externalRdvspId}`, {
        method: 'PATCH',
        body: JSON.stringify(userUpdateBody),
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('rdvsp user update error', error)
    }
  }
  const body = {
    user: {
      ...(beneficiary.externalRdvspId && { id: beneficiary.externalRdvspId }),
      first_name: beneficiary.firstName || 'Non renseigné',
      last_name:
        beneficiary.usualName || beneficiary.birthName || 'Non renseigné',
      ...(beneficiary.email && { email: beneficiary.email }),
      ...(beneficiary.phone1 && { phone_number: beneficiary.phone1 }),
      ...(address && { address }),
      ...(beneficiary.birthDate && {
        birth_date: formatDate(beneficiary.birthDate, 'YYYY-MM-DD')
      })
    },
    return_url: returnUrl,
    dossier_url: dossierUrl
  }

  const response = await fetch(`${cfg.issuer}/api/v1/rdv_plans`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })

  let res: any
  try {
    res = await response.json()
  } catch {
    console.log('rdvsp: other error', response.statusText)
    return { status: response.status, statusText: response.statusText }
  }

  if (response.ok) {
    return {
      id: res.rdv_plan.id as number,
      url: res.rdv_plan.url as string,
      user_id: res.rdv_plan.user_id as number
    }
  }
  console.log('rdvsp: draft rdv creation failed', res)
  return res as RdvspMutationError
}
