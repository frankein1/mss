import { SocialSupportSubjectRepo } from '~/server/database'
import type { SecurityRuleContext } from '~/server/security/rules/types'

export async function getActiveOrUsedSocialSupportSubjects({
  ctx
}: {
  ctx: SecurityRuleContext
}) {
  return await SocialSupportSubjectRepo.findMany(ctx.user, {
    where: {
      OR: [
        { inactive: false },
        {
          inactive: true,
          used: true
        }
      ]
    },
    orderBy: {
      name: 'asc'
    }
  })
}
