import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { IdInput, idSchema } from '~/server/schema'

import { PartnerOrganizationService } from '~/server/services'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = ({
  input,
  ctx
}: {
  input: IdInput
  ctx: ProtectedAppContext
}) => {
  return PartnerOrganizationService.makeActive({ input, ctx })
}

export const makeActive = createMutation({
  handler,
  inputValidation: idSchema,
  securityCheck: AllowSecurityCheck,
  auditLog: {
    key: 'partner.makeActive',
    target: 'PartnerOrganization',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
