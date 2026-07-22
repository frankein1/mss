import { prepareBeneficiaryStatFilters } from '../helpers'
import {
  BeneficiaryRepo,
  BeneficiaryConstraints,
  DataEducationSchoolRepo
} from '~/server/database'
import type { StatFilterInput } from '~/server/schema'
import type { SecurityRuleGrantee } from '~/server/security/rules/types'
import type { RepClassificationStatKey } from '~/client/labels/school.labels'

export async function getRepClassificationStatsQuery(
  user: SecurityRuleGrantee,
  input: StatFilterInput
) {
  // HACK: right solution is to abstract groupBy in repo
  const constraints = BeneficiaryConstraints.get(user)

  // repClassification lives on the related DataEducationSchool, not on
  // Beneficiary, so it cannot be grouped by directly: group by schoolUai
  // first, then re-aggregate using each school's classification.
  const beneficiariesSchools = await BeneficiaryRepo.prisma.groupBy({
    by: ['schoolUai'],
    where: {
      ...prepareBeneficiaryStatFilters(input),
      ...constraints
    },
    _count: true
  })

  const schoolUais = beneficiariesSchools
    .map(({ schoolUai }) => schoolUai)
    .filter((schoolUai): schoolUai is string => schoolUai !== null)

  const schools = await DataEducationSchoolRepo.findMany(user, {
    where: { uai: { in: schoolUais } },
    select: { uai: true, repClassification: true }
  })

  const repClassificationByUai = new Map(
    schools.map(({ uai, repClassification }) => [uai, repClassification])
  )

  const counts = new Map<RepClassificationStatKey, number>()
  for (const { schoolUai, _count } of beneficiariesSchools) {
    const key: RepClassificationStatKey = !schoolUai
      ? 'SchoolNotFilled'
      : (repClassificationByUai.get(schoolUai) ?? 'NonRep')
    counts.set(key, (counts.get(key) || 0) + _count)
  }

  return Array.from(counts.entries()).map(([repClassification, _count]) => ({
    repClassification,
    _count
  }))
}
