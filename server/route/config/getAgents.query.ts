import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { formatUserDisplayName } from '~/utils/user'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({ ctx: { user } }: { ctx: ProtectedAppContext }) => {
  return await prismaClient.user
    .findMany({
      where: {
        role: { not: 'Administrator' },
        structureId: user.structureId
      },
      orderBy: { lastName: 'asc' }
    })
    .then(agents =>
      agents.map(user => ({
        id: user.id,
        name: formatUserDisplayName(user),
        status: user.status
      }))
    )
}

export const getAgentsQuery = createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
