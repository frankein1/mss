import { createQuery } from '../createRequest'
import { SecurityRuleGrantee, canListUsers } from '~/server/security'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { emptySchema } from '~/server/schema'

const securityCheck = (user: SecurityRuleGrantee) => {
  return canListUsers(user)
}

const handler = async ({ ctx: { user } }: { ctx: ProtectedAppContext }) => {
  return await prismaClient.user.findMany({
    where: { structureId: user.structureId },
    orderBy: { role: 'asc' }
  })
}

export const getUsersQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck,
  handler
})
