import { CreateBeneficiaryInput } from '~/server/schema'
import { ProtectedAppContext, forbiddenError } from '~/server/trpc'
import { prismaClient } from '~/server/prisma'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { canCreateBeneficiary } from '~/server/security/rules'

export const createBeneficiaryHandler = async ({
  input,
  ctx: { user }
}: {
  input: CreateBeneficiaryInput
  ctx: ProtectedAppContext
}) => {
  const { structureId, referents, ...data } = input

  if (!canCreateBeneficiary(user, input)) {
    throw forbiddenError()
  }

  const fileNumber = generateFileNumber()

  const beneficiary = await prismaClient.beneficiary.create({
    data: {
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
