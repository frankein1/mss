import { UserActivityObject, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { PlanAppointmentInput, planAppointmentSchema } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security'
import { RdvspService } from '~/server/services'
import { StructureRepo } from '~/server/database'

const securityCheck = async (
  ctx: SecurityRuleContext,
  _: PlanAppointmentInput
) => {
  const structure = await StructureRepo.findUniqueOrThrow(ctx.user, {
    where: { id: ctx.structure.id },
    select: { externalRdvspActive: true }
  })
  return structure.externalRdvspActive || false
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
