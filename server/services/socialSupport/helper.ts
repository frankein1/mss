import { SocialSupportRepo } from '~~/server/database'
import type { SecurityRuleGrantee } from '~~/server/security'

export const getSocialSupportWithRedirections = async (
  user: SecurityRuleGrantee,
  id: string
) => {
  return await SocialSupportRepo.findUniqueOrThrow(user, {
    where: { id },
    select: {
      id: true,
      socialSupportRedirections: {
        select: { id: true, redirectionReasonId: true }
      }
    }
  })
}
