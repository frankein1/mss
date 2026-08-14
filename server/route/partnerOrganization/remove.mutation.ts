import { UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { IdInput } from '~~/server/schema'
import { idSchema } from '~~/server/schema'
import type { SecurityRuleContext } from '~~/server/security'
import { getAppContextPermissions } from '~~/server/security'
import { PartnerOrganizationRepo } from '~~/server/database'

const handler = ({
  input,
  ctx
}: {
  input: IdInput
  ctx: ProtectedAppContext
}) =>
  PartnerOrganizationRepo.update(ctx.user, {
    select: { id: true },
    where: {
      id: input.id,
      structureId: ctx.structure.id
    },
    data: {
      inactive: true
    }
  })

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
