import { UserActivityType } from '~/prisma/generated/client'
import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { AddPartnerOrganizationInput } from '~/server/schema'
import { addPartnerOrganizationSchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'

import { PartnerOrganizationService } from '~/server/services'

const handler = ({
  input,
  ctx
}: {
  input: AddPartnerOrganizationInput
  ctx: ProtectedAppContext
}) => {
  return PartnerOrganizationService.create({ input, ctx })
}

const securityCheck = (
  ctx: SecurityRuleContext,
  _input: AddPartnerOrganizationInput
) => {
  const appPermissions = getAppContextPermissions(ctx)

  return appPermissions.module.partner
}

export const create = createMutation({
  handler,
  inputValidation: addPartnerOrganizationSchema,
  securityCheck,
  auditLog: {
    key: 'partner.create',
    target: 'PartnerOrganization',
    targetId: ({ routeResult }) => {
      return routeResult.id
    },
    action: UserActivityType.CREATE
  }
})
