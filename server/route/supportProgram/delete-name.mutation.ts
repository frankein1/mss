import { UserActivityObject, UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { SecurityRuleContext } from '~~/server/security'
import { getAppContextPermissions } from '~~/server/security'
import { SupportProgramNameRepo } from '~~/server/database'
import { idSchema, type IdInput } from '~~/server/schema'
import { SupportProgramService } from '~~/server/services'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: IdInput
}) => {
  const deleted = await SupportProgramNameRepo.delete(ctx.user, {
    where: { id: input.id, structureId: ctx.structure.id },
    select: { id: true }
  })

  // Support programs are deleted in cascade, their exit reasons may be unused
  await SupportProgramService.deleteUnusedExitReasons(ctx)

  return deleted
}

export const deleteNameMutation = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'supportProgramName.delete',
    target: UserActivityObject.SupportProgramName,
    targetId: ({ input }) => input.id,
    action: UserActivityType.DELETE
  }
})
