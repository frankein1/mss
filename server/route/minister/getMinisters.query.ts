import { MinisterStatus } from '@prisma/client'
import { MinisterRepo } from '~/server/database'
import { createQuery } from '~/server/route'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import type { ProtectedAppContext } from '~/server/trpc'

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
  securityCheck: AllowSecurityCheck,
  handler
})
