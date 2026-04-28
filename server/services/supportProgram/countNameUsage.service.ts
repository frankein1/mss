import { SupportProgramNameRepo } from '~~/server/database'
import type { SecurityRuleContext } from '~~/server/security/rules/types'

export async function countSupportProgramNameUsage({
  ctx,
  supportProgramNameId
}: {
  ctx: SecurityRuleContext
  supportProgramNameId: string
}): Promise<number | undefined> {
  const res = await SupportProgramNameRepo.findMany(ctx.user, {
    where: { id: supportProgramNameId },
    select: {
      _count: { select: { supportPrograms: true, workshops: true } }
    }
  })

  const counts = res[0]?._count
  if (!counts) {
    return undefined
  }

  return (counts.supportPrograms ?? 0) + (counts.workshops ?? 0)
}
