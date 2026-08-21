import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import { emptySchema } from '~~/server/schema'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { BeneficiaryRepo, BeneficiaryConstraints } from '~~/server/database'

const handler = async ({ ctx: { user } }: { ctx: ProtectedAppContext }) => {
  // HACK: right solution is to abstract groupBy in repo
  const constraints = BeneficiaryConstraints.get(user)

  return await BeneficiaryRepo.prisma.groupBy({
    by: ['employer'],
    where: {
      // Employer is free text: an emptied field is stored as '' and must not
      // end up as a blank option in the stats filter
      employer: { not: null, notIn: [''] },
      ...constraints
    },
    orderBy: [{ employer: 'asc' }]
  })
}

export const getBeneficiariesEmployersQuery = createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
