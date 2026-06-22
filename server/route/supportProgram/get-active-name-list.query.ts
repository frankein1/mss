import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { SupportProgramNameRepo } from '~/server/database'

const handler = async ({ ctx }: { ctx: ProtectedAppContext }) => {
  // Also includes names only linked to workshops (not beneficiaries)
  return await SupportProgramNameRepo.findMany(ctx.user, {
    select: { id: true, name: true },
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
