import { SocialSupportSubjectRepo } from '~/server/database'
import type { SecurityRuleContext } from '~/server/security'

export function markUsed(ctx: SecurityRuleContext, ids: string[]) {
  return SocialSupportSubjectRepo.updateMany(ctx.user, {
    where: {
      id: {
        in: ids
      },
      ownedByStructureId: ctx.structure.id
    },
    data: {
      used: true
    }
  })
}
