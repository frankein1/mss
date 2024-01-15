import { StructureType, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { EditHelpRequestInput, editHelpRequestSchema } from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
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
  const permissions = await HelpRequestService.getEditionPermission(
    ctx,
    input.id
  )
  if (!permissions.edit) {
    return false
  }

  const appPermissions = getAppContextPermissions(ctx)

  const { prescribingOrganizationId, instructorOrganizationId } = input
  const { structure } = ctx

  if (
    isNewOption(prescribingOrganizationId) &&
    !appPermissions.create.prescribingOrganization
  ) {
    return false
  }
  if (
    isNewOption(instructorOrganizationId) &&
    !appPermissions.create.instructorOrganization
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

export const update = createMutation({
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
