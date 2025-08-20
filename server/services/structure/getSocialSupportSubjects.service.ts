import { SocialSupportSubjectRepo } from '~/server/database'
import type { SecurityRuleContext } from '~/server/security/rules/types'

/** Return all subjects whether active or not, used or not */
export async function getSocialSupportSubjects({
  ctx
}: {
  ctx: SecurityRuleContext
}) {
  return await SocialSupportSubjectRepo.findMany(ctx.user, {
    orderBy: { name: 'asc' }
  })
}
