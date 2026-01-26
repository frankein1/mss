import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { emptySchema } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { RdvspService } from '~/server/services'

const securityCheck = (ctx: SecurityRuleContext) => {
  const permissions = getAppContextPermissions({
    user: ctx.user,
    structure: ctx.structure
  })
  return permissions.module.rdv
}

const handler = async ({ ctx }: { ctx: ProtectedAppContext }) => {
  const appointments = await RdvspService.getAppointments({
    input: { userId: ctx.user.id, starts_after: new Date() },
    ctx
  })
  return appointments
}

export default createQuery({
  handler,
  inputValidation: emptySchema,
  securityCheck
})
