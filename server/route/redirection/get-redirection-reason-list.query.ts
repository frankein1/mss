import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { RedirectionReasonRepo } from '~/server/database'

const securityCheck = AllowSecurityCheck

const handler = ({ ctx }: { ctx: ProtectedAppContext }) =>
  RedirectionReasonRepo.findMany(ctx.user, {
    select: { id: true, name: true },
    where: { structureId: ctx.structure.id },
    orderBy: { name: 'asc' }
  })

export const getRedirectionReasonList = createQuery({
  inputValidation: emptySchema,
  securityCheck,
  handler
})
