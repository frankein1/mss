import { UserActivityType } from '@prisma/client'
import { CreateBeneficiaryInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

export const createBeneficiaryDraftHandler = async ({
  input,
  ctx: { user, structure }
}: {
  input: CreateBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  const beneficiaryDraft = await prismaClient.draft.create({
    data: {
      structureId: structure.id,
      createdById: user.id,
      content: { general: input }
    }
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.CREATE,
    object: 'Draft',
    objectId: beneficiaryDraft.id
  })

  return { id: beneficiaryDraft.id }
}
