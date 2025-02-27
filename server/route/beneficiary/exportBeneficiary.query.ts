import { createQuery } from '~/server/route'
import {
  ExportBeneficiaryInput,
  exportBeneficiarySchema
} from '~/server/schema/beneficiary/exportbeneficiary.schema'
import { SecurityRuleContext } from '~/server/security'
import { BeneficiaryService } from '~/server/services'
import { ProtectedAppContext } from '~/server/trpc'
import { UserActivityType } from '@prisma/client'

const securityCheck = async (
  ctx: SecurityRuleContext,
  input: ExportBeneficiaryInput
) => {
  const permission = await BeneficiaryService.getArchivePermissions({
    ctx,
    id: input.beneficiaryId
  })
  return permission.archive
}

const handler = async ({
  input,
  ctx
}: {
  input: ExportBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  const response = await BeneficiaryService.exportBeneficiary({
    ctx,
    input
  })

  return response
}

export const exportBeneficiaryQuery = createQuery({
  inputValidation: exportBeneficiarySchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.exportBeneficiary',
    target: 'Beneficiary',
    targetId: ({ ctx }) => {
      return ctx.user.id
    },
    action: UserActivityType.ARCHIVE
  }
})
