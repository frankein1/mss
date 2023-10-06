import { createQuery } from '../createRequest'
import { canOnlyListItsBeneficiaries } from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
  ctx: { user, structure }
}: {
  ctx: ProtectedAppContext
}) => {
  const referentsCondition = canOnlyListItsBeneficiaries(user)
    ? { some: { id: user.id } }
    : undefined

  return await prismaClient.beneficiary.groupBy({
    by: ['city'],
    where: {
      city: { not: null },
      structureId: structure.id,
      referents: referentsCondition
    },
    orderBy: [{ city: 'asc' }]
  })
}

export const getBeneficiariesCitiesQuery = createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
