import type { Prisma } from '@prisma/client'
import { SocialSupportType } from '@prisma/client'
import { prepareBeneficiaryStatFilters } from '../helpers'
import { BeneficiaryRepo } from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'

const BUCKETS = [
  { key: '0', label: '0 suivi', min: 0, max: 0 },
  { key: '1', label: '1 suivi', min: 1, max: 1 },
  { key: '2', label: '2 suivis', min: 2, max: 2 },
  { key: '3+', label: '3 suivis et plus', min: 3, max: undefined }
]

export async function getSocialSupportCountPerBeneficiaryStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  const filters = prepareBeneficiaryStatFilters(input)

  const socialSupportsFilter: Prisma.SocialSupportWhereInput = {
    ...filters.socialSupports?.some,
    socialSupportType: { not: SocialSupportType.Appointment }
  }

  const beneficiaries = await BeneficiaryRepo.findMany(user, {
    where: filters,
    select: {
      socialSupports: {
        where: socialSupportsFilter,
        select: { id: true }
      }
    }
  })

  const counts = BUCKETS.map(bucket => ({ ...bucket, _count: 0 }))

  beneficiaries.forEach(({ socialSupports }) => {
    const count = socialSupports.length
    const bucket = counts.find(
      ({ min, max }) => count >= min && (max === undefined || count <= max)
    )
    if (bucket) {
      bucket._count++
    }
  })

  return counts.map(({ key, label, _count }) => ({ key, label, _count }))
}
