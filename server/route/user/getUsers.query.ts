import { createQuery } from '~/server/route'
import { SecurityRuleGrantee, canListUsers } from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { UserRepo } from '~/server/database'

const securityCheck = (user: SecurityRuleGrantee) => {
  return canListUsers(user)
}

const handler = async ({ ctx: { user } }: { ctx: ProtectedAppContext }) => {
  return await UserRepo.findMany(user, {
    where: { structureId: user.structureId },
    orderBy: { role: 'asc' }
  })
}

export const getUsersQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck,
  handler
})
