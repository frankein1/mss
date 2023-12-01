import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { GetFollowupTypeInput, getFollowupTypeSchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { FollowupTypeRepo } from '~/server/database'

const handler = async ({
  ctx: { user },
  input
}: {
  ctx: ProtectedAppContext
  input: GetFollowupTypeInput
}) => {
  const types = await FollowupTypeRepo.findMany(user, {
    where: {
      name: { equals: input.name, mode: 'insensitive' },
      ownedByStructureId: input.structureId
    }
  })
  return types.length > 0 ? types[0] : null
}

export const getStructureFollowupTypeQuery = createQuery({
  handler,
  inputValidation: getFollowupTypeSchema,
  securityCheck: AllowSecurityCheck
})
