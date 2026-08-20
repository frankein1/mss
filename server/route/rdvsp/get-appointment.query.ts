import { createQuery } from '~~/server/route'
import type { ProtectedAppContext } from '~~/server/trpc'
import {
  getAppointmentSchema,
  type GetAppointmentInput
} from '~~/server/schema'
import type { SecurityRuleContext } from '~~/server/security'
import {
  getAppContextPermissions,
  validateOneBelongsToStructure
} from '~~/server/security'
import { BeneficiaryRepo } from '~~/server/database'
import { RdvspService } from '~~/server/services'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: GetAppointmentInput
) => {
  const permissions = getAppContextPermissions({
    user: ctx.user,
    structure: ctx.structure
  })
  if (!permissions.module.rdv) {
    return false
  }
  // A collective appointment supplies the participant's beneficiaryId; make sure it
  // belongs to the caller's structure before it drives the participation lookup.
  if (input.beneficiaryId) {
    return validateOneBelongsToStructure(
      ctx.user,
      input.beneficiaryId,
      BeneficiaryRepo.findUniqueOrThrow
    )
  }
  return true
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
