import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  EditPartnerOrganizationInput,
  editPartnerOrganizationSchema
} from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'

import { PartnerOrganizationService } from '~/server/services'

const handler = ({
  input,
  ctx
}: {
  input: EditPartnerOrganizationInput
  ctx: ProtectedAppContext
}) => {
  return PartnerOrganizationService.update({ input, ctx })
}

const securityCheck = (
  ctx: SecurityRuleContext,
  _input: EditPartnerOrganizationInput
) => {
  const appPermissions = getAppContextPermissions(ctx)

  return appPermissions.module.partner
}

export const update = createMutation({
  handler,
  inputValidation: editPartnerOrganizationSchema,
  securityCheck,
  auditLog: {
    key: 'partner.update',
    target: 'PartnerOrganization',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
