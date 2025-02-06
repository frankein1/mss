import { UserRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'
import { forbiddenError, unauthorizedError } from '~/server/trpc'
import { oauth } from '~/server/lib/rdvsp'
import { prismaClient } from '~/server/prisma'

/** Get a rdvsp authentication token from DB or a new one using RDVSP API if it
 * is expired or about to be
 */
export async function getAgentAuthInfo(user: SecurityRuleGrantee) {
  const u = await UserRepo.findUniqueOrThrow(user, {
    where: { id: user.id },
    select: {
      externalRdvspId: true,
      externalAccounts: {
        where: {
          type: 'rdvsp',
          accessToken: { not: null }
        },
        select: {
          id: true,
          accessToken: true,
          refreshToken: true,
          updated: true,
          expiresAt: true
        }
      }
    }
  })

  if (!u.externalRdvspId) {
    throw unauthorizedError(
      'rdvsp: integration not activated yet for this user'
    )
  }

  const connectedRdvspAccounts = u.externalAccounts.filter(
    acc => acc.accessToken !== null
  )

  const hasToken =
    connectedRdvspAccounts.length && connectedRdvspAccounts[0].accessToken

  if (!hasToken) {
    throw unauthorizedError('rdvsp: account not connected')
  }

  let accessToken = connectedRdvspAccounts[0].accessToken as string

  if (
    tokenIsExpired(
      connectedRdvspAccounts[0].updated,
      connectedRdvspAccounts[0].expiresAt || 0
    )
  ) {
    accessToken = await refreshToken(
      connectedRdvspAccounts[0].id,
      connectedRdvspAccounts[0].refreshToken
    )
  }

  return {
    externalRdvspId: u.externalRdvspId,
    accessToken
  }
}

function tokenIsExpired(updated: Date, expiresAt: number, toleranceInS = 120) {
  return (
    updated.getTime() + expiresAt * 1000 - new Date().getTime() <
    toleranceInS * 1000
  )
}

async function refreshToken(accountId: string, refreshToken: string | null) {
  const cfg = oauth.getConfig()

  if (!refreshToken) {
    throw unauthorizedError('rdvsp: refresh token not available')
  }

  const token = await oauth.getTokenFromRefreshToken(cfg, refreshToken)

  if ('error' in token || !token) {
    throw unauthorizedError(
      'rdvsp: could not retrieve new token from refresh token'
    )
  }

  await prismaClient.externalAccount.update({
    where: { id: accountId },
    data: {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: token.expires_in
    }
  })

  return token.access_token
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
    throw unauthorizedError(
      'rdvsp: integration is not setup for this structure'
    )
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

export type RdvspStatus = keyof typeof APPOINTMENT_STATUS
