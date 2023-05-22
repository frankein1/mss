import { v4 } from 'uuid'
import { CreateBeneficiaryInput } from '~/server/schema'
import { AppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { generateFileNumber } from '~/utils/generateFileNumber'

export const createBeneficiaryHandler = async ({
  input,
  ctx: { user }
}: {
  input: CreateBeneficiaryInput
  ctx: AppContext
}) => {
  const { structureId, referents, ...data } = input

  const id = v4()
  const fileNumber = generateFileNumber()

  const beneficiary = await prismaClient.beneficiary.create({
    data: {
      id,
      structureId,
      fileNumber,
      referents: {
        connect: referents.map(referent => ({ id: referent }))
      },
      createdById: user.id,
      ...data
    }
  })

  return { id: beneficiary.id }
}
