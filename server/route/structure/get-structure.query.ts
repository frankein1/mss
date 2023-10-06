import { createQuery } from '../createRoute'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'

const handler = async ({
  ctx: { structure }
}: {
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.structure.findUnique({
    where: { id: structure.id },
    include: {
      followupTypes: {
        include: {
          _count: {
            select: { followups: true, helpRequests: true }
          }
        },
        orderBy: {
          name: 'asc'
        }
      }
    }
  })
}

export const getCurrentUserStructureQuery = createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck
})
