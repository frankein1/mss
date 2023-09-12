import { UserActivityType } from '@prisma/client'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'
import { canDeleteBeneficiaryDraft } from '~/server/security/rules'

export const deleteBeneficiaryDraftHandler = async ({
  input,
  ctx: { user }
}: {
  input: { id: string }
  ctx: ProtectedAppContext
}) => {
  const beneficiaryDraft = await prismaClient.beneficiaryDraft.findUnique({
    where: {
      id: input.id
    }
  })

  if (!beneficiaryDraft || !canDeleteBeneficiaryDraft(user, beneficiaryDraft)) {
    throw forbiddenError()
  }

  await prismaClient.beneficiaryDraft.delete({
    where: { id: input.id }
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.DELETE,
    object: 'BeneficiaryDraft',
    objectId: beneficiaryDraft.id
  })
}
