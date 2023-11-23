import { UserActivityType } from '@prisma/client'
import { createMutation } from '~/server/route'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import {
  UpdateBeneficiaryDraftInput,
  updateBeneficiaryDraftSchema
} from '~/server/schema'
import { SecurityRuleGrantee } from '~/server/security'
import type { BeneficiaryDraft } from '~/types/beneficiary'
import { DraftRepo } from '~/server/database'
import { isCreator } from '~/server/security/rules/helpers'
import { updateBeneficiaryIncomesRelations } from '~/utils/beneficiary/updateBeneficiaryIncomesRelations'
import { prepareDraftData } from '~/utils'

const securityCheck = async (
  grantee: SecurityRuleGrantee,
  input: UpdateBeneficiaryDraftInput
) => {
  const beneficiaryDraft = (await DraftRepo.findUniqueOrThrow(grantee, {
    where: { id: input.id }
  })) as BeneficiaryDraft

  return isCreator(grantee, beneficiaryDraft)
}

const handler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryDraftInput
  ctx: ProtectedAppContext
}) => {
  const beneficiaryDraft = (await DraftRepo.findUniqueOrThrow(user, {
    where: { id: input.id }
  })) as BeneficiaryDraft

  if (!beneficiaryDraft?.content) {
    throw forbiddenError()
  }

  const draftContent = prepareDraftData(input, beneficiaryDraft)

  const updatedBeneficiaryDraft = await DraftRepo.prisma.update({
    where: { id: input.id },
    data: {
      content: draftContent
    }
  })

  await updateBeneficiaryIncomesRelations(user, input.id, draftContent)

  return updatedBeneficiaryDraft
}

export const updateBeneficiaryDraftMutation = createMutation({
  inputValidation: updateBeneficiaryDraftSchema,
  handler,
  securityCheck,
  auditLog: {
    key: 'beneficiaryDraft.update',
    target: 'Draft',
    targetId: ({ input }) => {
      return input.id
    },
    action: UserActivityType.UPDATE
  }
})
