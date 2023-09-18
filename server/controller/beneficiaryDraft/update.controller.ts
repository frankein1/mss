import { UserActivityType } from '@prisma/client'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UpdateBeneficiaryDraftInput } from '~/server/schema'
import { canUpdateDraft } from '~/server/security/rules'

export const updateBeneficiaryDraftHandler = async ({
  input: { id: draftId, general },
  ctx: { user }
}: {
  input: UpdateBeneficiaryDraftInput
  ctx: ProtectedAppContext
}) => {
  const beneficiaryDraft = await prismaClient.draft.findUnique({
    where: { id: draftId }
  })

  if (!beneficiaryDraft || !canUpdateDraft(user, beneficiaryDraft)) {
    throw forbiddenError()
  }

  const updatedBeneficiaryDraft = await prismaClient.draft.update({
    where: { id: draftId },
    data: {
      content: { general }
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
