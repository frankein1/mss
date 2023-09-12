import { UserActivityType } from '@prisma/client'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { UpdateBeneficiaryDraftInput } from '~/server/schema'
import { canUpdateBeneficiaryDraft } from '~/server/security/rules'

export const updateBeneficiaryDraftHandler = async ({
  input,
  ctx: { user }
}: {
  input: UpdateBeneficiaryDraftInput
  ctx: ProtectedAppContext
}) => {
  const beneficiaryDraft = await prismaClient.beneficiaryDraft.findUnique({
    where: { id: input.id }
  })

  if (!beneficiaryDraft || !canUpdateBeneficiaryDraft(user, beneficiaryDraft)) {
    throw forbiddenError()
  }

  const updatedBeneficiaryDraft = await prismaClient.beneficiaryDraft.update({
    where: { id: input.id },
    data: {
      general: input.general
    }
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.UPDATE,
    object: 'BeneficiaryDraft',
    objectId: beneficiaryDraft.id
  })

  return updatedBeneficiaryDraft
}
