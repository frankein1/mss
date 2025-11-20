import { createQuery } from '~/server/route'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { UserRepo } from '~/server/database'

const securityCheck = (ctx: SecurityRuleContext) =>
  getAppContextPermissions(ctx).module.users

const handler = async ({ ctx }: { ctx: ProtectedAppContext }) => {
  return await getUsers(ctx)
}

export const getUsers = async (ctx: ProtectedAppContext) => {
  return await UserRepo.findMany(ctx.user, {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      status: true,
      role: true,
      aidantConnectAuthorisation: true,
      externalRdvspId: true,
      referentFor: true,
      _count: { select: { referentFor: true } }
    },
    orderBy: { role: 'asc' }
  })
}

export const getUsersQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck,
  handler
})
