import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { idSchema, type IdInput } from '~/server/schema'
import { SupportProgramNameRepo } from '~/server/database'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).edit.structure

const handler = async ({
  ctx,
  input
}: {
  ctx: ProtectedAppContext
  input: IdInput
}) => {
  const res = await SupportProgramNameRepo.findMany(ctx.user, {
    where: { id: input.id },
    select: {
      _count: { select: { supportPrograms: true, workshops: true } }
    }
  })

  const counts = res[0]?._count
  return (counts?.supportPrograms ?? 0) + (counts?.workshops ?? 0)
}

export const countNameUsageQuery = createQuery({
  inputValidation: idSchema,
  securityCheck,
  handler
})
