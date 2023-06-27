import { Prisma } from '@prisma/client'
import { newOptionToLabel, NEW_OPTION_PREFIX } from '~/utils/options'
import { canCreatePrescribingOrganization } from '~/server/security/rules'
import type { ProtectedAppContext } from '~/server/trpc'

export async function preparePrescribingOrganization(
  transaction: Prisma.TransactionClient,
  user: ProtectedAppContext['user'],
  prescribingOrganizationId: string | null | undefined
) {
  if (
    canCreatePrescribingOrganization(user) &&
    prescribingOrganizationId?.startsWith(NEW_OPTION_PREFIX)
  ) {
    const { id } = await transaction.prescribingOrganization.create({
      data: {
        name: newOptionToLabel(prescribingOrganizationId),
        structureId: user.structureId,
        createdById: user.id
      }
    })
    return id
  }

  return prescribingOrganizationId
}
