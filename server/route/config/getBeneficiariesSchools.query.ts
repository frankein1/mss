import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import {
  BeneficiaryRepo,
  BeneficiaryConstraints,
  DataEducationSchoolRepo
} from '~/server/database'

const handler = async ({ ctx: { user } }: { ctx: ProtectedAppContext }) => {
  // HACK: right solution is to abstract groupBy in repo
  const constraints = BeneficiaryConstraints.get(user)

  const beneficiariesSchools = await BeneficiaryRepo.prisma.groupBy({
    by: ['schoolUai'],
    where: {
      schoolUai: { not: null },
      ...constraints
    }
  })

  const schoolUais = beneficiariesSchools
    .map(({ schoolUai }) => schoolUai)
    .filter((schoolUai): schoolUai is string => schoolUai !== null)

  const schools = await DataEducationSchoolRepo.findMany(user, {
    where: { uai: { in: schoolUais } },
    select: { uai: true, name: true, city: true, zipcode: true },
    orderBy: [{ name: 'asc' }]
  })

  return schools
}

export const getBeneficiariesSchoolsQuery = createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
