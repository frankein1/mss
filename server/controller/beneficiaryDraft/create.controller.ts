import { UserActivityType } from '@prisma/client'
import { CreateBeneficiaryInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

export const createBeneficiaryDraftHandler = async ({
  input,
  ctx: { user }
}: {
  input: CreateBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  const beneficiaryDraft = await prismaClient.beneficiaryDraft.create({
    data: {
      structureId: user.structureId,
      createdById: user.id,
      general: input
    }
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.CREATE,
    object: 'BeneficiaryDraft',
    objectId: beneficiaryDraft.id
  })

  return { id: beneficiaryDraft.id }
}
