import { UserActivityObject, UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { PlanAppointmentInput, planAppointmentSchema } from '~/server/schema'
import { SecurityRuleContext } from '~/server/security/rules/types'
import { RdvspService, FamilyFileService } from '~/server/services'
import { BeneficiaryRepo } from '~/server/database'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: PlanAppointmentInput
) => {
  const ben = await BeneficiaryRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.beneficiaryId },
    select: { familyFileId: true }
  })

  const permissions = await FamilyFileService.getEditionPermissions(
    ctx,
    ben.familyFileId
  )

  // TODO add entry for rdvsp
  if (!permissions.create) {
    return false
  }
  return true
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
    // FIXME Rdvsp
    target: UserActivityObject.Beneficiary,
    targetId: tg => tg.input.beneficiaryId,
    action: UserActivityType.CREATE
  }
})
