import { createQuery } from '../createRoute'
import { prismaClient } from '~/server/prisma'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { emptySchema } from '~/server/schema'

export const handler = async ({
  ctx: { structure }
}: {
  ctx: ProtectedAppContext
}) => {
  return await prismaClient.prescribingOrganization.findMany({
    where: {
      structureId: structure.id
    },
    orderBy: [{ name: 'asc' }]
  })
}

export const getPrescribingOrganizationsQuery = createQuery({
  handler,
  securityCheck: AllowSecurityCheck,
  inputValidation: emptySchema
})
