import { Prisma, User } from '@prisma/client'
import { newOptionToLabel, NEW_OPTION_PREFIX } from '~/utils/options'
import { canCreateInstructorOrganization } from '~/server/security/rules'

export async function prepareInstructorOrganization(
  transaction: Prisma.TransactionClient,
  user: User,
  instructorOrganizationId: string | null | undefined
) {
  if (
    canCreateInstructorOrganization(user) &&
    instructorOrganizationId?.startsWith(NEW_OPTION_PREFIX)
  ) {
    const { id } = await transaction.instructorOrganization.create({
      data: {
        name: newOptionToLabel(instructorOrganizationId),
        structureId: user.structureId,
        createdById: user.id
      }
    })
    return id
  }

  return instructorOrganizationId
}
