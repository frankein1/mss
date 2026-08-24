import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import { emptySchema } from '~~/server/schema'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { SupportProgramNameRepo } from '~~/server/database'

// Count only support programs => linked to beneficiaries and not workshops
const handler = async ({ ctx }: { ctx: ProtectedAppContext }) => {
  return await SupportProgramNameRepo.findMany(ctx.user, {
    select: { id: true, name: true, hasLifecycle: true },
    where: {
      structureId: ctx.structure.id,
      supportPrograms: { some: {} }
    },
    orderBy: { name: 'asc' }
  })
}

export const getActiveSupportProgramNameListQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck,
  handler
})
