import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { emptySchema } from '~/server/schema'
import { PrescribingOrganizationRepo } from '~/server/database'

export const handler = async ({
  ctx: { structure, user }
}: {
  ctx: ProtectedAppContext
}) => {
  return await PrescribingOrganizationRepo.findMany(user, {
    where: {
      structureId: structure.id
    },
    orderBy: [{ name: 'asc' }]
  })
}

export const getPrescribingOrganizationsQuery = createQuery({
  handler,
  securityCheck: AllowSecurityCheck,
  inputValidation: emptySchema
})
