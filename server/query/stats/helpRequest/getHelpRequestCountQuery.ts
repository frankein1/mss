import { Prisma, SocialSupportType } from '@prisma/client'
import { prepareHelpRequestStatFilters } from '../helpers'
import { SocialSupportRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { HelpRequestSubject } from '~/types/socialSupport'

const externalHelpRequestFilter = {
  socialSupportType: SocialSupportType.HelpRequest,
  helpRequest: { externalStructure: true }
}
const externalHousingHelpRequestFilter = {
  socialSupportType: SocialSupportType.HelpRequestHousing,
  housingHelpRequest: { externalStructure: true }
}

function prepareExternalHelpRequestFilter(
  socialSupportTypeFilter: Prisma.SocialSupportWhereInput['socialSupportType']
) {
  if (socialSupportTypeFilter === 'HelpRequest') {
    return externalHelpRequestFilter
  }

  if (socialSupportTypeFilter === 'HelpRequestHousing') {
    return externalHousingHelpRequestFilter
  }

  return { OR: [externalHelpRequestFilter, externalHousingHelpRequestFilter] }
}

export async function getHelpRequestCountQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const { socialSupportType: socialSupportTypeFilter, ...filters } =
    prepareHelpRequestStatFilters(input)

  const externalHelpRequestFilter = prepareExternalHelpRequestFilter(
    socialSupportTypeFilter
  )

  const [total, financial, other, external] = await Promise.all([
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        socialSupportType: socialSupportTypeFilter || {
          in: ['HelpRequest', 'HelpRequestHousing']
        }
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        socialSupportType: socialSupportTypeFilter || 'HelpRequest',
        helpRequest: { financialSupport: true }
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        socialSupportType: socialSupportTypeFilter || 'HelpRequest',
        helpRequest: { financialSupport: false }
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        ...externalHelpRequestFilter
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
