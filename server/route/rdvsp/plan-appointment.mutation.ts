import { UserActivityObject, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { PlanAppointmentInput, planAppointmentSchema } from '~/server/schema'
import {
  SecurityRuleContext,
  getAppContextPermissions
} from '~/server/security'
import { RdvspService } from '~/server/services'

const securityCheck = (ctx: SecurityRuleContext, _: PlanAppointmentInput) => {
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
  input: PlanAppointmentInput
  ctx: ProtectedAppContext
}) => {
  return RdvspService.planAppointment({ input, ctx })
}

export const planAppointment = createMutation({
  handler,
  inputValidation: planAppointmentSchema,
  securityCheck,
  auditLog: {
    key: 'rdvsp.planApppointment',
    target: UserActivityObject.Appointment,
    targetId: tg => tg.input.beneficiaryId,
    action: UserActivityType.CREATE
  }
})
