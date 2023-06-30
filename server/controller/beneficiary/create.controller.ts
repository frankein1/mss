import { UserActivityType } from '@prisma/client'
import { CreateBeneficiaryInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { addUserActivity } from '~/server/query/userActivity/addUserActivity'

export const createBeneficiaryHandler = async ({
  input,
  ctx: { user }
}: {
  input: CreateBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  const { referents, ...data } = input

  const fileNumber = generateFileNumber()

  const beneficiary = await prismaClient.beneficiary.create({
    data: {
      structureId: user.structureId,
      fileNumber,
      referents: {
        connect: referents.map(referent => ({ id: referent }))
      },
      createdById: user.id,
      ...data
    }
  })

  await addUserActivity({
    userId: user.id,
    activity: UserActivityType.CREATE,
    object: 'Beneficiary',
    objectId: beneficiary.id
  })

  return { id: beneficiary.id }
}
