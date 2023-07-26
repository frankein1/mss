import { prismaClient } from '~/server/prisma'
import { notfoundError } from '~/server/trpc'

export async function getBeneficiaryWithRelations(id: string) {
  const beneficiary = await prismaClient.beneficiary.findUnique({
    where: { id },
    include: {
      referents: true,
      relatives: {
        include: {
          linkedBeneficiary: true
        }
      },
      documents: true
    }
  })
  if (!beneficiary) {
    throw notfoundError()
  }
  return beneficiary
}
