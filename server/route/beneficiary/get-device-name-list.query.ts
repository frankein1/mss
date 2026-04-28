import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BeneficiaryDeviceNameRepo } from '~/server/database'

const handler = ({ ctx }: { ctx: ProtectedAppContext }) =>
  BeneficiaryDeviceNameRepo.findMany(ctx.user, {
    select: { id: true, name: true },
    where: { structureId: ctx.structure.id }
  })

export const getDeviceNameListQuery = createQuery({
  inputValidation: emptySchema,
  securityCheck: AllowSecurityCheck,
  handler
})
