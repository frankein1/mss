import { createQuery } from '~/server/route'
import { prismaClient } from '~/server/prisma'
import { ProtectedAppContext } from '~/server/trpc'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { emptySchema } from '~/server/schema'

const handler = async ({ ctx: { user } }: { ctx: ProtectedAppContext }) => {
  return await prismaClient.instructorOrganization.findMany({
    where: {
      structureId: user.structureId
    },
    orderBy: [{ name: 'asc' }]
  })
}

export const getInstructorOrganizationQuery = createQuery({
  handler,
  securityCheck: AllowSecurityCheck,
  inputValidation: emptySchema
})
