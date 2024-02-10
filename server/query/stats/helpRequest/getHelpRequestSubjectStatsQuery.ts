import { prepareSocialSupportStatFilters } from '../helpers'
import { SocialSupportRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { HelpRequestSubject } from '~/types/socialSupport'

export async function getHelpRequestSubjectStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const filters = prepareSocialSupportStatFilters(input)

  const [housingCount, financialCount, otherCount] = await Promise.all([
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        socialSupportType: 'HelpRequestHousing'
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        socialSupportType: 'HelpRequest',
        fileInstruction: { helpRequest: { financialSupport: true } }
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        socialSupportType: 'HelpRequest',
        fileInstruction: { helpRequest: { financialSupport: false } }
      }
    })
  ])

  return [
    { _count: housingCount, subject: HelpRequestSubject.Housing },
    { _count: financialCount, subject: HelpRequestSubject.Financial },
    { _count: otherCount, subject: HelpRequestSubject.Other }
  ]
}
