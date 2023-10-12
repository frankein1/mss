import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { emptySchema } from '~/server/schema'
import { FollowupTypeRepo } from '~/server/repository/FollowupTypeRepository'

const handler = async ({
  ctx: { structure, user }
}: {
  ctx: ProtectedAppContext
}) => {
  return await FollowupTypeRepo.findMany(user, {
    where: {
      ownedByStructureId: structure.id
    },
    orderBy: [{ name: 'asc' }]
  })
}

export const getStructureFollowupTypesQuery = createQuery({
  handler,
  securityCheck: AllowSecurityCheck,
  inputValidation: emptySchema
})
