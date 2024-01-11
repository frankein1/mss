import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  idSchema,
  IdInput,
  beneficiaryIdSchema,
  BeneficiaryIdInput
} from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { HelpRequestService } from '~/server/services'

const handler = ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: IdInput | BeneficiaryIdInput
}) => {
  if ('beneficiaryId' in input) {
    return HelpRequestService.getCreatePermission(ctx, input.beneficiaryId)
  }

  return HelpRequestService.getUpdatePermission(ctx, input.id)
}

export const getHelpRequestPermissionsQuery = createQuery({
  inputValidation: beneficiaryIdSchema.or(idSchema),
  securityCheck: AllowSecurityCheck,
  handler
})
