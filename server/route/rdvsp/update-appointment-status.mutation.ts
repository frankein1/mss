import { UserActivityObject, UserActivityType } from '@prisma/client'
import { createMutation } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import type { UpdateAppointmentStatusInput } from '~~/server/schema'
import { updateAppointmentStatusSchema } from '~~/server/schema'
import type { SecurityRuleContext } from '~~/server/security'
import { getAppContextPermissions } from '~~/server/security'
import { RdvspService } from '~~/server/services'

const securityCheck = (
  ctx: SecurityRuleContext,
  _: UpdateAppointmentStatusInput
) => {
  const permissions = getAppContextPermissions({
    user: ctx.user,
    structure: ctx.structure
  })
  return permissions.module.rdv
}

const handler = ({
  input,
  ctx
}: {
  input: UpdateAppointmentStatusInput
  ctx: ProtectedAppContext
}) => {
  return RdvspService.updateAppointmentStatus({ input, ctx })
}

const updateAppointmentStatusMutation = createMutation({
  handler,
  inputValidation: updateAppointmentStatusSchema,
  securityCheck,
  auditLog: {
    key: 'rdvsp.updateAppointmentStatus',
    target: UserActivityObject.Appointment,
    targetId: target => String(target.input.id),
    action: UserActivityType.UPDATE
  }
})

export default updateAppointmentStatusMutation
