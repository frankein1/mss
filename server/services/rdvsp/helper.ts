import { getConfig, refreshToken } from '~/server/lib/rdvsp-oauth.client'
import { forbiddenError, unauthorizedError } from '~/server/trpc'
import { ofetch, type FetchHooks } from 'ofetch'
import { shouldLog } from '~/server/utils/logging.js'

import { prismaClient } from '~/server/prisma'
import picocolors from 'picocolors'

export async function getAgentAuthInfo(userId: string) {
  const externalAccount = await prismaClient.externalAccount.findUniqueOrThrow({
    where: {
      userId_type_provider: { userId, type: 'rdvsp', provider: 'Email' }
    },
    select: {
      id: true,
      accessToken: true,
      refreshToken: true
    }
  })
  if (!externalAccount.accessToken || !externalAccount.refreshToken) {
    throw unauthorizedError('rdvsp: account not connected')
  }
  return {
    id: externalAccount.id,
    accessToken: externalAccount.accessToken,
    refreshToken: externalAccount.refreshToken
  }
}

const onResponseDebug: FetchHooks['onResponse'] = ({
  request,
  response,
  options
}) => {
  const duration = Date.now() - (options as any).startTime
  console.log(
    picocolors.bgCyan(picocolors.bold(picocolors.whiteBright(' RDVSP '))),
    picocolors[response.status < 400 ? 'green' : 'red'](
      picocolors.bold(response.status)
    ),
    picocolors.bold(options.method ?? 'GET'),
    '|',
    picocolors.underline(
      typeof request === 'string' ? request : 'request_path'
    ),
    '|',
    picocolors.bold(duration + 'ms')
  )
}

const onResponse = shouldLog('rdvsp') ? onResponseDebug : undefined

export async function getAgentClient({ user_id }: { user_id: string }) {
  const config = getConfig()
  const agentAuthInfo = await getAgentAuthInfo(user_id)
  const client = ofetch.create({
    baseURL: `${config.issuer}/api/v1`,
    headers: {
      Authorization: `Bearer ${agentAuthInfo.accessToken}`
    },
    onRequest({ options }) {
      ;(options as any).startTime = Date.now()
      options.headers.set('x-start-time', Date.now().toString())
    },
    onResponse,
    onResponseError: async error => {
      try {
        onResponse?.(error)
        if (error.response?.status === 401) {
          // Try to refresh token
          const data = await refreshToken(agentAuthInfo.refreshToken)
          await prismaClient.externalAccount.update({
            where: { id: agentAuthInfo.id },
            data: {
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              scope: data.scope
              // TODO: handle expiresAt
            }
          })
        }
      } catch (error) {
        console.error(error)
      }
    }
  })

  return client
}

export function checkIntegrationSetupForStructure(structure: {
  externalRdvspActive: boolean | null
  externalRdvspId: string | null
}) {
  if (!structure.externalRdvspActive) {
    throw forbiddenError('Rdvsp integration not active for structure')
  }

  if (!structure.externalRdvspId) {
    // Structure setup is performed on administrator first login to rdvsp
    // Throw error to redirect to rdvsp signin to perform setup
    throw unauthorizedError('Rdvsp integration is not setup for this structure')
  }
}

export function getAppointmentRdvspUrl(
  baseUrl: string,
  organisationId: string,
  rdvId: string
) {
  return `${baseUrl}/admin/organisations/${organisationId}/rdvs/${rdvId}`
}

export const APPOINTMENT_STATUS = {
  seen: 'RdvSeen',
  noshow: 'RdvNoShow',
  excused: 'RdvExcused',
  revoked: 'RdvRevoked'
} as const
