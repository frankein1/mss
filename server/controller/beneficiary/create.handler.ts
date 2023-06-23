import { CreateBeneficiaryInput } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { generateFileNumber } from '~/utils/generateFileNumber'

export const createBeneficiaryHandler = async ({
  input,
  ctx: { user }
}: {
  input: CreateBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  const { referents, ...data } = input

  const fileNumber = generateFileNumber()

  // FIXME: Should it prevent creating forbidden data (nir, etc.) ?
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

  return { id: beneficiary.id }
}
