import { createQuery } from '~/server/route'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { UserRepo } from '~/server/database'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.users

const handler = async ({ ctx: { user } }: { ctx: ProtectedAppContext }) => {
  return await UserRepo.findMany(user, {
    orderBy: { role: 'asc' }
  })
}

export const getUsersQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck,
  handler
})
