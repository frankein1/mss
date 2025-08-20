import { createMutation } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { WorkshopNameRepo } from '~/server/database/repository/WorkshopNameRepository'

const securityCheck = AllowSecurityCheck

const handler = ({ ctx }: { ctx: ProtectedAppContext }) =>
  WorkshopNameRepo.findMany(ctx.user, {
    select: { id: true, name: true },
    where: { structureId: ctx.structure.id }
  })

export const getWorkshopNameList = createMutation({
  inputValidation: emptySchema,
  securityCheck,
  handler
})
