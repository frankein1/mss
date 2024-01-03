import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext } from '~/server/trpc'
import { SaveDraftInput, saveDraftSchema } from '~/server/schema'
import { DraftRepo } from '~/server/database'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { BeneficiaryService } from '~/server/services'

const handler = async ({
  input,
  ctx
}: {
  input: SaveDraftInput
  ctx: ProtectedAppContext
}) => {
  const beneficiaryDraft = await DraftRepo.findUniqueOrThrow(ctx.user, {
    where: { id: input.id }
  })

  return await BeneficiaryService.create({
    ctx,
    input,
    draftId: beneficiaryDraft.id
  })
}

export const saveDraftMutation = createMutation({
  inputValidation: saveDraftSchema,
  securityCheck: AllowSecurityCheck,
  handler,
  auditLog: {
    key: 'beneficiary.saveDraft',
    target: 'Beneficiary',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.CREATE
  }
})
