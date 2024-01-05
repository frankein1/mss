import { StructureType, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { EditHelpRequestInput, editHelpRequestSchema } from '~/server/schema'
import {
  SecurityRuleContext,
  canCreateInstructorOrganization,
  canCreatePrescribingOrganization,
  getHelpRequestPermissions
} from '~/server/security'
import { getHelpRequestSecurityTarget } from '~/server/query'
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
  ctx: SecurityRuleContext,
  input: EditHelpRequestInput
) => {
  const target = await getHelpRequestSecurityTarget(ctx.user, input.id)
  const permissions = getHelpRequestPermissions({ ctx, target })
  if (!permissions.edit) {
    return false
  }

  const { prescribingOrganizationId, instructorOrganizationId } = input
  const { user, structure } = ctx

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

  if (
    (input.numeroPegase || input.ministre) &&
    structure.type !== StructureType.Ministere
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
