import { Minister } from '@prisma/client'
import { prepareBeneficiaryStatFilters } from '../helpers'
import { BeneficiaryRepo } from '~/server/database'
import { StatFilterInput } from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security/rules/types'

export async function getMinistereInterpellationStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const beneficiariesWithMinistreHistory = await BeneficiaryRepo.findMany(
    user,
    {
      where: {
        ...prepareBeneficiaryStatFilters(input),
        socialSupports: {
          some: {
            ministre: { not: null }
          }
        }
      },
      select: {
        socialSupports: {
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
      ...new Set([...beneficiary.socialSupports.map(ss => ss.ministre)])
    ])
    .forEach(interpellations =>
      interpellations.forEach(interpellation => {
        if (interpellation) {
          interpellationsCount[interpellation] =
            (interpellationsCount[interpellation] || 0) + 1
        }
      })
    )

  return Object.entries(interpellationsCount)
    .map(([key, value]) => ({
      ministre: key,
      _count: value
    }))
    .sort(({ _count: countA }, { _count: countB }) => countB - countA)
}
