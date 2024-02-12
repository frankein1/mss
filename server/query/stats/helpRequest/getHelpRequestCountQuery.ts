import { FileInstructionType } from '@prisma/client'
import { prepareSocialSupportStatFilters } from '../helpers'
import { SocialSupportRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

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
        fileInstruction: { helpRequest: { financialSupport: true } }
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        socialSupportType: 'HelpRequest',
        fileInstruction: { helpRequest: { financialSupport: false } }
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
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
