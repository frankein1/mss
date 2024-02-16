import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  AddPartnerOrganizationInput,
  addPartnerOrganizationSchema
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
    key: 'partner.update',
    target: 'PartnerOrganization',
    targetId: ({ routeResult }) => {
      return routeResult.id
    },
    action: UserActivityType.CREATE
  }
})
