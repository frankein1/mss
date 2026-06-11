import { createQuery } from '~/server/route'
import type { ProtectedAppContext } from '~/server/trpc'
import { getAppointmentSchema, type GetAppointmentInput } from '~/server/schema'
import type { SecurityRuleContext } from '~/server/security'
import { getAppContextPermissions } from '~/server/security'
import { RdvspService } from '~/server/services'

const securityCheck = (ctx: SecurityRuleContext) => {
  const permissions = getAppContextPermissions({
    user: ctx.user,
    structure: ctx.structure
  })
  return permissions.rdv.access
}

const handler = ({
  input,
  ctx
}: {
  input: GetAppointmentInput
  ctx: ProtectedAppContext
}) => {
  return RdvspService.getAppointment({ input, ctx })
}

export default createQuery({
  handler,
  inputValidation: getAppointmentSchema,
  securityCheck
})
