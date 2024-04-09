import { UserActivityType } from '@prisma/client'
import { ProtectedAppContext } from '~/server/trpc'
import { SecurityRuleContext } from '~/server/security'
import { IdInput, idSchema } from '~/server/schema'
import { createMutation } from '~/server/route/createRoute'
import { BeneficiaryRepo } from '~/server/database'
import { BeneficiaryService } from '~/server/services'

const securityCheck = async (ctx: SecurityRuleContext, input: IdInput) => {
  const permissions = await BeneficiaryService.getEditionPermissions(
    ctx,
    input.id
  )
  return permissions.delete
}

const handler = async ({
  input: { id }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  await BeneficiaryRepo.prisma.delete({ where: { id, draft: true } })
}

export const deleteBeneficiaryDraftMutation = createMutation({
  inputValidation: idSchema,
  securityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.deleteDraft',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.DELETE
  }
})
