import { SocialSupportType } from '@prisma/client'
import { prepareHelpRequestStatFilters } from '../helpers'
import { SocialSupportConstraints, SocialSupportRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { appendConstraints } from '~/server/database/repository/helper/appendConstraints'
import { HelpRequestSubject } from '~/types/socialSupport'

export async function getHelpRequestSubjectStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const where = {
    where: prepareHelpRequestStatFilters(input)
  }
  appendConstraints(user, where, SocialSupportConstraints.get)

  const [housingCount, financialCount, otherCount] = await Promise.all([
    SocialSupportRepo.count(user, {
      where: {
        ...where.where,
        socialSupportType: SocialSupportType.HelpRequestHousing
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        ...where.where,
        socialSupportType: SocialSupportType.HelpRequest,
        helpRequest: { financialSupport: true }
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        ...where.where,
        socialSupportType: SocialSupportType.HelpRequest,
        helpRequest: { financialSupport: false }
      }
    })
  ])

  return [
    { _count: housingCount, subject: HelpRequestSubject.Housing },
    { _count: financialCount, subject: HelpRequestSubject.Financial },
    { _count: otherCount, subject: HelpRequestSubject.Other }
  ]
}
