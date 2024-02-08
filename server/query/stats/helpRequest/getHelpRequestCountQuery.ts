import { FileInstructionType } from '@prisma/client'
import { prepareHelpRequestStatFilters } from '../helpers'
import { SocialSupportRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getHelpRequestCountQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const { socialSupportType: socialSupportTypeFilter, ...filters } =
    prepareHelpRequestStatFilters(input)

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
        fileInstruction: { helpRequest: { financialSupport: true } }
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        socialSupportType: socialSupportTypeFilter || 'HelpRequest',
        fileInstruction: { helpRequest: { financialSupport: false } }
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        socialSupportType: socialSupportTypeFilter || {
          in: ['HelpRequest', 'HelpRequestHousing']
        },
        fileInstruction: { externalStructure: true }
      }
    })
  ])

  return {
    total,
    [FileInstructionType.Financial]: financial,
    [FileInstructionType.Other]: other,
    external
  }
}
