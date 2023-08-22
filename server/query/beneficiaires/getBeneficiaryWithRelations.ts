import { prismaClient } from '~/server/prisma'
import { notfoundError } from '~/server/trpc'
import { BENEFICIARY_RELATIONS_INCLUDE } from '~/utils/constants/beneficiary'

export async function getBeneficiaryWithRelations(id: string) {
  const beneficiary = await prismaClient.beneficiary.findUnique({
    where: { id },
    include: BENEFICIARY_RELATIONS_INCLUDE
  })
  if (!beneficiary) {
    throw notfoundError()
  }
  return beneficiary
}
