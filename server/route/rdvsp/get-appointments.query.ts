import { createQuery } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import { RdvspService } from '~/server/services'
import type { SecurityRuleContext } from '~/server/security'
import { StructureRepo } from '~/server/database'

const securityCheck = async (ctx: SecurityRuleContext) => {
  const structure = await StructureRepo.findUniqueOrThrow(ctx.user, {
    where: { id: ctx.structure.id },
    select: { externalRdvspActive: true }
  })
  return structure.externalRdvspActive || false
}

const handler = ({ ctx }: { ctx: ProtectedAppContext }) =>
  RdvspService.getAppointments({ ctx })

export const getAppointments = createQuery({
  inputValidation: emptySchema,
  securityCheck,
  handler
})
