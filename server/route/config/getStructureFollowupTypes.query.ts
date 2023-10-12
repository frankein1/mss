import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { emptySchema } from '~/server/schema'

const handler = async ({
  ctx: { structure }
}: {
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.followupType.findMany({
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
