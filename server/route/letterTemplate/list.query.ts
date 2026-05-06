import { createQuery } from '~/server/route'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import type { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'

const handler = async ({ ctx }: { ctx: ProtectedAppContext }) => {
  return prismaClient.letterTemplate.findMany({
    where: { structureId: ctx.user.structureId as string },
    select: {
      id: true,
      name: true,
      s3Key: true,
      createdAt: true,
      createdBy: { select: { firstName: true, lastName: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export const listLetterTemplatesQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck,
  handler
})
