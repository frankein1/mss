import { prepareSocialSupportStatFilters } from '../helpers'
import { SocialSupportRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { HelpRequestSubject } from '~/types/socialSupport'

export async function getHelpRequestCountQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const filters = prepareSocialSupportStatFilters(input)

  const [total, financial, other, external] = await Promise.all([
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        socialSupportType: { in: ['HelpRequest', 'HelpRequestHousing'] }
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        socialSupportType: 'HelpRequest',
        helpRequest: { financialSupport: true }
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        socialSupportType: 'HelpRequest',
        helpRequest: { financialSupport: false }
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        OR: [
          {
            socialSupportType: 'HelpRequest',
            helpRequest: { externalStructure: true }
          },
          {
            socialSupportType: 'HelpRequestHousing',
            housingHelpRequest: { externalStructure: true }
          }
        ]
      }
    })
  ])

  return {
    total,
    [HelpRequestSubject.Financial]: financial,
    [HelpRequestSubject.Other]: other,
    external
  }
}
