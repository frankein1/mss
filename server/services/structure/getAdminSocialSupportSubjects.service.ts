import { SocialSupportSubjectRepo } from '~/server/database'
import type { SecurityRuleContext } from '~/server/security/rules/types'

export async function getAdminSocialSupportSubjects({
  ctx
}: {
  ctx: SecurityRuleContext
}) {
  return await SocialSupportSubjectRepo.findMany(ctx.user, {
    where: {
      ownedByStructureId: ctx.structure.id
    },
    orderBy: {
      name: 'asc'
    }
  })
}
