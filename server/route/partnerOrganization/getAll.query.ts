import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { emptySchema } from '~/server/schema'
import { PartnerOrganizationRepo } from '~/server/database'

export const handler = async ({
  ctx: { structure, user }
}: {
  ctx: ProtectedAppContext
}) => {
  return await PartnerOrganizationRepo.findMany(user, {
    where: {
      structureId: structure.id,
      inactive: false
    },
    orderBy: [{ name: 'asc' }]
  })
}

export const getAll = createQuery({
  handler,
  securityCheck: AllowSecurityCheck,
  inputValidation: emptySchema
})
