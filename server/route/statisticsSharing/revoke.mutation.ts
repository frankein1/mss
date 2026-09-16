import { UserActivityObject, UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { SecurityRuleContext } from '~~/server/security'
import { getAppContextPermissions } from '~~/server/security'
import { idSchema, type IdInput } from '~~/server/schema'
import { StatisticsSharingRepo } from '~~/server/database'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

/**
 * Révoque une autorisation. La ligne est conservée avec sa date de révocation
 * plutôt que supprimée, pour garder la trace de qui a eu accès et jusqu'à
 * quand. Les contraintes du repository garantissent qu'une structure ne peut
 * révoquer que ses propres autorisations.
 */
const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: IdInput
}) => {
  return StatisticsSharingRepo.update(ctx.user, {
    where: { id: input.id },
    data: { revokedAt: new Date() },
    select: { id: true }
  })
}

export const revokeStatisticsSharingMutation = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'statisticsSharing.revoke',
    target: UserActivityObject.Structure,
    targetId: ({ ctx }) => ctx.structure.id,
    action: UserActivityType.UPDATE
  }
})
