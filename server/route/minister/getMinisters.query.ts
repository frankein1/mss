import { MinisterRepo } from '~/server/database'
import { createQuery } from '~/server/route'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import type { ProtectedAppContext } from '~/server/trpc'

// TODO: use MinisterRepo.findMany
const handler = async ({ ctx }: { ctx: ProtectedAppContext }) => {
  return await MinisterRepo.prisma.findMany({
    where: {},
    select: {
      id: true,
      firstName: true,
      lastName: true,
      function: true,
      ministry: true,
      government: true,
      former: true
    },
    orderBy: { lastName: 'asc' }
  })
}

export const getMinisters = createQuery({
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck,
  handler
})
