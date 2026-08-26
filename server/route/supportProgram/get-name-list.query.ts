import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import { emptySchema } from '~~/server/schema'
import { AllowSecurityCheck } from '~~/server/security/rules/types'
import { SupportProgramNameRepo } from '~~/server/database'

const handler = async ({ ctx }: { ctx: ProtectedAppContext }) => {
  const names = await SupportProgramNameRepo.findMany(ctx.user, {
    select: { id: true, name: true, hasLifecycle: true },
    where: {
      structureId: ctx.structure.id
    }
  })

  return names.sort((a, b) => a.name.localeCompare(b.name, 'fr'))
}

export const getSupportProgramNameListQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck,
  handler
})
