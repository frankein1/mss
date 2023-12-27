import { Minister } from '@prisma/client'
import { BeneficiaryRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'
import { prepareBeneficiaryStatFilters } from '~/utils/filters'

export async function getMinistereInterpellationStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const beneficiariesWithMinistreHistory = await BeneficiaryRepo.findMany(
    user,
    {
      where: {
        ...prepareBeneficiaryStatFilters(input),
        OR: [
          {
            helpRequests: {
              some: {
                ministre: { not: null }
              }
            }
          },
          {
            followups: {
              some: {
                ministre: { not: null }
              }
            }
          }
        ]
      },
      select: {
        helpRequests: {
          where: {
            ministre: { not: null }
          }
        },
        followups: {
          where: {
            ministre: { not: null }
          }
        }
      }
    }
  )

  const interpellationsCount: { [key in Minister]?: number } = {}

  beneficiariesWithMinistreHistory
    .map(beneficiary => [
      ...new Set([
        ...beneficiary.followups.map(followup => followup.ministre),
        ...beneficiary.helpRequests.map(helpRequest => helpRequest.ministre)
      ])
    ])
    .forEach(interpellations =>
      interpellations.forEach(interpellation => {
        if (interpellation) {
          interpellationsCount[interpellation] =
            (interpellationsCount[interpellation] || 0) + 1
        }
      })
    )

  return Object.entries(interpellationsCount).map(([key, value]) => ({
    ministre: key,
    _count: value
  }))
}
