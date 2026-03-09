import type { Prisma } from '@prisma/client'
import { prepareBeneficiaryStatFilters } from '../helpers'
import { BeneficiaryRepo } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'
import { formatMinisterName } from '~/utils/minister'

export async function getMinistereInterpellationStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const filters = prepareBeneficiaryStatFilters(input)

  let socialSupportsSelect: Prisma.SocialSupportWhereInput
  if (filters.socialSupports?.some?.ministerId) {
    socialSupportsSelect = {
      ministerId: filters.socialSupports.some.ministerId
    }
  } else {
    socialSupportsSelect = { ministerId: { not: null } }
  }

  const beneficiariesWithMinistreHistory = await BeneficiaryRepo.findMany(
    user,
    {
      where: {
        ...filters,
        socialSupports: {
          some: {
            ministerId: { not: null }
          },
          ...(filters.socialSupports || {})
        }
      },
      select: {
        socialSupports: {
          where: socialSupportsSelect,
          select: {
            minister: true
          }
        }
      }
    }
  )

  const interpellationsCount: { [key in string]: number } = {}

  beneficiariesWithMinistreHistory
    .map(beneficiary => [
      ...new Set([
        ...beneficiary.socialSupports.map(ss => {
          if (ss.minister) {
            return formatMinisterName(ss.minister)
          }
        })
      ])
    ])
    .forEach(ministers => {
      return ministers.forEach(minister => {
        if (minister) {
          interpellationsCount[minister] =
            (interpellationsCount[minister] || 0) + 1
        }
      })
    })

  return Object.entries(interpellationsCount)
    .map(([key, value]) => ({
      ministre: key,
      _count: value
    }))
    .sort(({ _count: countA }, { _count: countB }) => countB - countA)
}
