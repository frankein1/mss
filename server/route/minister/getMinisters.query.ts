import { MinisterStatus, StructureType } from '@prisma/client'
import { MinisterRepo } from '~/server/database'
import { createQuery } from '~/server/route'
import { emptySchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import type { ProtectedAppContext } from '~/server/trpc'

const securityCheck = async (ctx: SecurityRuleContext) => {
  return ctx.structure.type === StructureType.Ministere
}

const handler = async ({ ctx }: { ctx: ProtectedAppContext }) => {
  return await MinisterRepo.findMany(ctx.user, {
    where: {
      status: { not: MinisterStatus.Deleted }
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      function: true,
      government: true,
      status: true
    },
    orderBy: { lastName: 'asc' }
  })
}

export const getMinisters = createQuery({
  inputValidation: emptySchema,
  securityCheck,
  handler
})
