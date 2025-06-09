import { UserActivityObject, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { PlanAppointmentInput, planAppointmentSchema } from '~/server/schema'
import {
  getIntegrationContextPermissions,
  SecurityRuleContext
} from '~/server/security'
import { RdvspService } from '~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  _: PlanAppointmentInput
) => {
  const integrations = await getIntegrationContextPermissions(ctx)
  return integrations.rdv
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
