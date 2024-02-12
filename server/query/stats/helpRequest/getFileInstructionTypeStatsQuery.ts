import { FileInstructionType } from '@prisma/client'
import { prepareSocialSupportStatFilters } from '../helpers'
import { SocialSupportRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getFileInstructionTypeStatsQuery(
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

  console.log({ housingCount, financialCount, otherCount })

  return [
    { _count: housingCount, subject: FileInstructionType.Housing },
    { _count: financialCount, subject: FileInstructionType.Financial },
    { _count: otherCount, subject: FileInstructionType.Other }
  ]
}
