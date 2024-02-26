import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  EditPartnerOrganizationInput,
  editPartnerOrganizationSchema
} from '~/server/schema'

import { PartnerOrganizationService } from '~/server/services'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = ({
  input,
  ctx
}: {
  input: EditPartnerOrganizationInput
  ctx: ProtectedAppContext
}) => {
  return PartnerOrganizationService.update({ input, ctx })
}

export const update = createMutation({
  handler,
  inputValidation: editPartnerOrganizationSchema,
  securityCheck: AllowSecurityCheck,
  auditLog: {
    key: 'partner.update',
    target: 'PartnerOrganization',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
