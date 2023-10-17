import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BeneficiaryRepo } from '~/server/repository'

const handler = async ({ ctx: { user } }: { ctx: ProtectedAppContext }) => {
  const constraints = BeneficiaryRepo.viewConstraints(user)

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
