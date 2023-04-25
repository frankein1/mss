import { BeneficiaryStatus } from '@prisma/client'
import { v4 } from 'uuid'
import { generateFileNumber } from '~/utils/generateFileNumber'
import { prismaClient } from '~/server/prisma'
import { BeneficiaryCreationInput } from '~/server/schema'

async function createBeneficiary(
  input: BeneficiaryCreationInput,
  user: { id: string }
) {
  const { structureId, referents, ...data } = input

  const id = v4()
  const fileNumber = generateFileNumber()

  const beneficiary = await prismaClient.beneficiary.create({
    data: {
      id,
      status: BeneficiaryStatus.Active,
      structureId,
      fileNumber,
      referents: {
        connect: referents.map(referent => ({ id: referent }))
      },
      createdById: user.id,
      ...data
    }
  })

  return { beneficiary }
}

export { createBeneficiary }
