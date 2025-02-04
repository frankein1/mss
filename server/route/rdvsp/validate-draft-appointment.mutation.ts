import { UserActivityObject, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import {
  ValidateDraftAppointmentInput,
  validateDraftAppointmentSchema
} from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { RdvspService } from '~/server/services'

const securityCheck = (
  ctx: SecurityRuleContext,
  _: ValidateDraftAppointmentInput
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
  input: ValidateDraftAppointmentInput
  ctx: ProtectedAppContext
}) => {
  return RdvspService.validateDraftAppointment({ input, ctx })
}

export const validateDraftAppointment = createMutation({
  handler,
  inputValidation: validateDraftAppointmentSchema,
  securityCheck,
  auditLog: {
    key: 'rdvsp.validateDraftApppointment',
    target: UserActivityObject.Appointment,
    targetId: tg => tg.input.socialSupportId,
    action: UserActivityType.CREATE
  }
})
