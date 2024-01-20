import { StructureType, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  EditHousingHelpRequestInput,
  editHousingHelpRequestSchema
} from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { isNewOption } from '~/utils/options'
import { HousingHelpRequestService } from '~/server/services'

const handler = ({
  input,
  ctx
}: {
  input: EditHousingHelpRequestInput
  ctx: ProtectedAppContext
}) => {
  return HousingHelpRequestService.update({ ctx, input })
}

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: EditHousingHelpRequestInput
) => {
  const permissions = await HousingHelpRequestService.getEditionPermissions(
    ctx,
    input.id
  )
  if (!permissions.edit) {
    return false
  }

  const appPermissions = getAppContextPermissions(ctx)

  const { instructorOrganizationId } = input
  const { structure } = ctx

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
  inputValidation: editHousingHelpRequestSchema,
  handler,
  auditLog: {
    key: 'housingHelpRequest.update',
    target: 'HousingHelpRequest',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
