import {
  getConfig,
  refreshToken,
  type RdvspRdv
} from '~~/server/lib/rdvsp-oauth.client'
import { forbiddenError, unauthorizedError } from '~~/server/trpc'
import { ofetch, type FetchHooks } from 'ofetch'
import { shouldLog } from '~~/server/utils/logging.js'

import { prismaClient } from '~~/server/prisma'
import picocolors from 'picocolors'

import { SocialSupportStatus } from '@prisma/client'
import { RdvspStatus } from '~~/types/rdvsp'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

// Given an MSS userId, it retrieves the matching RDVSP agent's auth info
export async function getAgentAuthInfo(userId: string) {
  const externalAccount = await prismaClient.externalAccount.findUnique({
    where: {
      userId_provider: { userId, provider: 'rdvsp' }
    },
    select: {
      id: true,
      expiresAt: true,
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
    expiresAt: externalAccount.expiresAt,
    refreshToken: externalAccount.refreshToken
  }
}

// Given an MSS userId, it retrieves the matching RDVSP agent's auth info,
// and refreshes the access token. It returns the updated auth info.
export async function refreshAgentToken(userId: string) {
  const agentAuthInfo = await getAgentAuthInfo(userId)
  const data = await refreshToken(agentAuthInfo.refreshToken)
  return prismaClient.externalAccount.update({
    where: { id: agentAuthInfo.id },
    select: {
      id: true,
      expiresAt: true,
      accessToken: true,
      refreshToken: true
    },
    data: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      scope: data.scope,
      expiresAt: new Date((data.created_at + data.expires_in) * 1000)
    }
  })
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
    // Include 401 in retried status codes, so that expired access tokens (2H)
    // are refreshed, and the initial HTTP request is retried.
    retryStatusCodes: [401, 408, 409, 425, 429, 500, 502, 503, 504],
    async onRequest({ options }) {
      ;(options as any).startTime = Date.now()
      options.headers.set('x-start-time', Date.now().toString())

      const agentAuthInfo = await getAgentAuthInfo(user_id)
      let accessToken = agentAuthInfo.accessToken
      if (
        !agentAuthInfo.expiresAt ||
        Date.now() + 5000 >= new Date(agentAuthInfo.expiresAt).getTime()
      ) {
        const refreshedAgentAuthInfo = await refreshAgentToken(user_id)
        if (!refreshedAgentAuthInfo.accessToken) {
          throw unauthorizedError(
            'rdsvp: Failed to retrieve agent token after refresh'
          )
        }
        accessToken = refreshedAgentAuthInfo.accessToken
      }
      options.headers.set('Authorization', `Bearer ${accessToken}`)
    },
    onResponse,
    onResponseError: async error => {
      try {
        onResponse?.(error)
        if (error.response?.status === 401) {
          await refreshAgentToken(user_id)
        }
      } catch (error) {
        console.error(error)
      }
    }
  })

  return client
}

/** In order to use the integration :
 * 1. the structure must be activated through the app back-office : route toggleRdvsp.
 * 2. the app must hold the RDV SP id of the structure. If not, a 401 error is thrown and the
 * frontend will redirect to the RDV SP login page to perform first login and retrieve
 * the RDVSP ID of the structure.
 */
export function throwIfStructureIsNotSetup(structure: {
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

export function findBeneficiaryParticipation(
  rdv: RdvspRdv,
  beneficiaryExternalRdvspIds: number[]
) {
  return rdv.participations?.find(p =>
    beneficiaryExternalRdvspIds.includes(p.user.id)
  )
}

/**
 * Two-case status resolution keyed on the instance flag `rdv.collectif`:
 * - Individual rdv: the authoritative status is on the rdv itself (`rdv.status`).
 * - Collective rdv: the status lives on the beneficiary's participation, not on
 *   the rdv. Fall back to `rdv.status` when the beneficiary has no participation.
 *
 * The caller passes the already-matched participation (via
 * `findBeneficiaryParticipation`) so the lookup is done once at the call site and
 * both the list and detail paths share this single rule.
 */
export function getStatusFromRdv(
  rdv: Pick<RdvspRdv, 'collectif' | 'status'>,
  participation?: { status: RdvspStatus }
): RdvspStatus {
  if (!rdv.collectif) {
    return rdv.status
  }
  return participation?.status ?? rdv.status
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
