import { StructureType, UserActivityType } from '@prisma/client'
import { prepareHelpRequestUpdateData } from './helper'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { EditHelpRequestInput, editHelpRequestSchema } from '~/server/schema'
import {
  SecurityRuleGrantee,
  canCreateInstructorOrganization,
  canCreatePrescribingOrganization,
  getHelpRequestPermissions
} from '~/server/security'
import {
  getHelpRequestWithRelations,
  getHelpRequestSecurityTarget,
  getStructureByUser,
  markFollowupTypeAsUsed
} from '~/server/query'
import { HelpRequestRepo } from '~/server/database'
import { isNewOption } from '~/utils/options'

const handler = async ({
  input,
  ctx
}: {
  input: EditHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  const { user } = ctx

  const target = await getHelpRequestWithRelations(user, input.id)

  const data = prepareHelpRequestUpdateData(input, ctx, target)

  const helpRequest = await HelpRequestRepo.prisma.update({
    where: { id: input.id },
    data,
    include: {
      beneficiary: {
        select: {
          id: true,
          fileNumber: true
        }
      }
    }
  })

  await markFollowupTypeAsUsed([input.typeId])

  return { helpRequest }
}

const securityCheck = async (
  user: SecurityRuleGrantee,
  input: EditHelpRequestInput
) => {
  const [target, structure] = await Promise.all([
    getHelpRequestSecurityTarget(user, input.id),
    getStructureByUser(user)
  ])
  const permissions = getHelpRequestPermissions({ user, target, structure })
  if (!permissions.edit) {
    return false
  }

  const { prescribingOrganizationId, instructorOrganizationId } = input

  if (
    isNewOption(prescribingOrganizationId) &&
    !canCreatePrescribingOrganization(user)
  ) {
    return false
  }
  if (
    isNewOption(instructorOrganizationId) &&
    !canCreateInstructorOrganization(user)
  ) {
    return false
  }

  if (input.privateSynthesis && permissions.set.privateSynthesis) {
    return false
  }

  const { type } = await getStructureByUser(user)
  if (
    (input.numeroPegase || input.ministre) &&
    type !== StructureType.Ministere
  ) {
    return false
  }

  return true
}

export const updateHelpRequestMutation = createMutation({
  securityCheck,
  inputValidation: editHelpRequestSchema,
  handler,
  auditLog: {
    key: 'helpRequest.update',
    target: 'HelpRequest',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
