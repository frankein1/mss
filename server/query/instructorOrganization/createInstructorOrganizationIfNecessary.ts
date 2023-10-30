import { Prisma } from '@prisma/client'
import { newOptionToLabel, NEW_OPTION_PREFIX } from '~/utils/options'
import {
  canCreateInstructorOrganization,
  SecurityRuleGrantee
} from '~/server/security'

export async function createInstructorOrganizationIfNecessary(
  transaction: Prisma.TransactionClient,
  user: SecurityRuleGrantee,
  instructorOrganizationId: string | null | undefined
) {
  if (!canCreateInstructorOrganization(user)) {
    return instructorOrganizationId
  }
  if (!instructorOrganizationId?.startsWith(NEW_OPTION_PREFIX)) {
    return instructorOrganizationId
  }
  const { id } = await transaction.instructorOrganization.create({
    data: {
      name: newOptionToLabel(instructorOrganizationId),
      structureId: user.structureId,
      createdById: user.id
    }
  })
  return id
}
