import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import { emptySchema } from '~~/server/schema'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { SupportProgramExitReasonRepo } from '~~/server/database'

const handler = ({ ctx }: { ctx: ProtectedAppContext }) =>
  SupportProgramExitReasonRepo.findMany(ctx.user, {
    where: { structureId: ctx.structure.id },
    select: {
      id: true,
      name: true
    },
    orderBy: { name: 'asc' }
  })

export const getExitReasonListQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck,
  handler
})
