import { UserRepo } from '~/server/database'
import { SecurityRuleGrantee } from '~/server/security'
import { forbiddenError, unauthorizedError } from '~/server/trpc'

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
          accessToken: true
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

  return {
    externalRdvspId: u.externalRdvspId,
    accessToken: connectedRdvspAccounts[0].accessToken as string
  }
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

export type RdvspStatus = keyof typeof APPOINTMENT_STATUS
