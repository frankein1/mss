import { SocialSupportSubjectRepo } from '~/server/database'
import { SecurityRuleContext } from '~/server/security/rules/types'

export async function getCreateSocialSupportSubjects({
  ctx: { user }
}: {
  ctx: SecurityRuleContext
}) {
  return await SocialSupportSubjectRepo.findManyWithNoInactiveCondition(user, {
    orderBy: {
      name: 'asc'
    }
  })
}
