import { createQuery } from '~/server/route'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { UserRepo } from '~/server/database'

const securityCheck = (ctx: SecurityRuleContext) => {
  return getAppContextPermissions(ctx).view.users
}

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
