import { StructureType, UserActivityType } from '@prisma/client'
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
  getHelpRequestSecurityTarget,
  getStructureByUser
} from '~/server/query'
import { isNewOption } from '~/utils/options'
import { HelpRequestService } from '~/server/services'

const handler = ({
  input,
  ctx
}: {
  input: EditHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  return HelpRequestService.update({ ctx, input })
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
