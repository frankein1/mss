import { UserActivityType } from '@prisma/client'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UpdateBeneficiaryDraftInput } from '~/server/schema'
import { canUpdateDraft } from '~/server/security/rules'
import type { BeneficiaryDraft } from '~/types/beneficiary'

export const updateBeneficiaryDraftHandler = async ({
  input: { id: draftId, general, taxHousehold, entourage, health },
  ctx: { user }
}: {
  input: UpdateBeneficiaryDraftInput
  ctx: ProtectedAppContext
}) => {
  const beneficiaryDraft = (await prismaClient.draft.findUnique({
    where: { id: draftId }
  })) as BeneficiaryDraft | null

  if (!beneficiaryDraft?.content || !canUpdateDraft(user, beneficiaryDraft)) {
    throw forbiddenError()
  }

  const updatedBeneficiaryDraft = await prismaClient.draft.update({
    where: { id: draftId },
    data: {
      content: {
        general: general || beneficiaryDraft.content.general,
        taxHousehold: taxHousehold || beneficiaryDraft.content.taxHousehold,
        entourage: entourage || beneficiaryDraft.content.entourage,
        health: health || beneficiaryDraft.content.health
        // TODO: add other sections
      }
    }
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.UPDATE,
    object: 'Draft',
    objectId: beneficiaryDraft.id
  })

  return updatedBeneficiaryDraft
}
