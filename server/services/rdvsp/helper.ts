import { getConfig, refreshToken } from '~/server/lib/rdvsp-oauth.client'
import { forbiddenError, unauthorizedError } from '~/server/trpc'
import { ofetch, type FetchHooks } from 'ofetch'
import { shouldLog } from '~/server/utils/logging.js'

import { prismaClient } from '~/server/prisma'
import picocolors from 'picocolors'

import { SocialSupportStatus } from '@prisma/client'
import { RdvspStatus } from '~/types/rdvsp'
import dayjs from 'dayjs'

export async function getAgentAuthInfo(userId: string) {
  const externalAccount = await prismaClient.externalAccount.findUnique({
    where: {
      userId_type_provider: { userId, type: 'rdvsp', provider: 'Email' }
    },
    select: {
      id: true,
      accessToken: true,
      refreshToken: true
    }
  })
  if (externalAccount === null) {
    throw unauthorizedError('rdvsp: account has not been setup yet')
  }
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

export function getAgentClient({ user_id }: { user_id: string }) {
  const config = getConfig()
  const client = ofetch.create({
    baseURL: `${config.issuer}/api/v1`,
    retryStatusCodes: [401, 408, 409, 425, 429, 500, 502, 503, 504],
    async onRequest({ options }) {
      ;(options as any).startTime = Date.now()
      options.headers.set('x-start-time', Date.now().toString())

      const agentAuthInfo = await getAgentAuthInfo(user_id)
      options.headers.set(
        'Authorization',
        `Bearer ${agentAuthInfo.accessToken}`
      )
    },
    onResponse,
    onResponseError: async error => {
      try {
        onResponse?.(error)
        if (error.response?.status === 401) {
          // Try to refresh token
          const agentAuthInfo = await getAgentAuthInfo(user_id)
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

export function mapRdvspRdvStatusToAppointmentStatus(status: RdvspStatus) {
  switch (status) {
    case RdvspStatus.Excused:
      return SocialSupportStatus.RdvExcused
    case RdvspStatus.NoShow:
      return SocialSupportStatus.RdvNoShow
    case RdvspStatus.Revoked:
      return SocialSupportStatus.RdvRevoked
    case RdvspStatus.Seen:
      return SocialSupportStatus.RdvSeen
    case RdvspStatus.Unknown:
      return SocialSupportStatus.RdvUnknown
  }
}

/** Dates in RDV SP entered by the user are in the timezone "Europe/Paris".
 *
 * Here the raw datetime information is retrieved and the UTC timezone applied
 * with NO CHANGE to the time and date e.g:
 *
 * - 2026-01-27 12:00 +0100 -> 2026-01-27T12:00Z
 * - 2026-06-01 12:00 +0200 -> 2026-06-01T12:00Z for summer time
 *
 * In the frontend, the conversion will be made to utc to retrieve the original date and time.
 */
export function castAppointmentDatestringToUTC(startsAt: string) {
  return new Date(
    dayjs(startsAt).tz('Europe/Paris').format('YYYY-MM-DDTHH:mm[Z]')
  )
}
