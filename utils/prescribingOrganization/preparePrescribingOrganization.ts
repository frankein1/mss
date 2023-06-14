import { Prisma, User } from '@prisma/client'
import { newOptionToLabel, NEW_OPTION_PREFIX } from '~/utils/options'
import { canCreatePrescribingOrganization } from '~/server/security/rules'

export async function preparePrescribingOrganization(
  transaction: Prisma.TransactionClient,
  user: User,
  structureId: string,
  prescribingOrganizationId: string | null | undefined
) {
  if (
    canCreatePrescribingOrganization(user) &&
    prescribingOrganizationId?.startsWith(NEW_OPTION_PREFIX)
  ) {
    const { id } = await transaction.prescribingOrganization.create({
      data: {
        name: newOptionToLabel(prescribingOrganizationId),
        structureId,
        createdById: user.id
      }
    })
    return id
  }

  return prescribingOrganizationId
}
