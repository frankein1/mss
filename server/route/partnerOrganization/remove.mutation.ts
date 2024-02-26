import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { IdInput, idSchema } from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'

import { PartnerOrganizationService } from '~/server/services'

const handler = ({
  input,
  ctx
}: {
  input: IdInput
  ctx: ProtectedAppContext
}) => {
  return PartnerOrganizationService.remove({ input, ctx })
}

const securityCheck = (ctx: SecurityRuleContext, _input: IdInput) => {
  const appPermissions = getAppContextPermissions(ctx)

  return appPermissions.module.partner
}

export const remove = createMutation({
  handler,
  inputValidation: idSchema,
  securityCheck,
  auditLog: {
    key: 'partner.delete',
    target: 'PartnerOrganization',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.DELETE
  }
})
