import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BeneficiaryRepo, getConstraintOnBeneficiary } from '~/server/database'

const handler = async ({ ctx: { user } }: { ctx: ProtectedAppContext }) => {
  // HACK: right solution is to abstract groupBy in repo
  const constraints = getConstraintOnBeneficiary(user)

  return await BeneficiaryRepo.groupBy({
    by: ['city'],
    where: {
      city: { not: null },
      ...constraints
    },
    orderBy: [{ city: 'asc' }]
  })
}

export const getBeneficiariesCitiesQuery = createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
