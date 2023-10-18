import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { emptySchema } from '~/server/schema'
import { FollowupTypeRepo } from '~/server/database'

const handler = async ({ ctx: { user } }: { ctx: ProtectedAppContext }) => {
  return await FollowupTypeRepo.findMany(user, {
    orderBy: [{ name: 'asc' }]
  })
}

export const getStructureFollowupTypesQuery = createQuery({
  handler,
  securityCheck: AllowSecurityCheck,
  inputValidation: emptySchema
})
