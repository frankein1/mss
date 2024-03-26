import { SocialSupportSubjectRepo } from '~/server/database'
import { SecurityRuleContext } from '~/server/security/rules/types'

export async function getSocialSupportSubjects({
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
