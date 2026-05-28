import { FileInstructionType } from '@prisma/client'
import { prepareSocialSupportStatFilters } from '../helpers'
import { SocialSupportRepo } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getFileInstructionTypeStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const filters = prepareSocialSupportStatFilters(input)
  const deviceNameIds = input.deviceNameIds?.length ? input.deviceNameIds : null

  const [housingCount, financialCount, otherCount] = await Promise.all([
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        socialSupportType: 'HelpRequestHousing',
        ...(deviceNameIds
          ? {
              fileInstruction: {
                housingHelpRequest: {
                  beneficiaryDevice: { deviceNameId: { in: deviceNameIds } }
                }
              }
            }
          : {})
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        socialSupportType: 'HelpRequest',
        fileInstruction: {
          helpRequest: {
            financialSupport: true,
            ...(deviceNameIds
              ? {
                  beneficiaryDevice: { deviceNameId: { in: deviceNameIds } }
                }
              : {})
          }
        }
      }
    }),
    SocialSupportRepo.count(user, {
      where: {
        ...filters,
        socialSupportType: 'HelpRequest',
        fileInstruction: {
          helpRequest: {
            financialSupport: false,
            ...(deviceNameIds
              ? {
                  beneficiaryDevice: { deviceNameId: { in: deviceNameIds } }
                }
              : {})
          }
        }
      }
    })
  ])

  return [
    { _count: housingCount, subject: FileInstructionType.Housing },
    { _count: financialCount, subject: FileInstructionType.Financial },
    { _count: otherCount, subject: FileInstructionType.Other }
  ]
}
